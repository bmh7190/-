from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Tag, Post, Comment, Bookmark
from .serializers import TagSerializer, PostSerializer, CommentSerializer,BookmarkSerializer
from users.models import User

from rest_framework.decorators import api_view, permission_classes,APIView
from rest_framework.permissions import AllowAny,IsAuthenticated

class TagList(APIView):
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagDetail(APIView):
    def get(self, request, pk):
        tag = get_object_or_404(Tag, pk=pk)
        serializer = TagSerializer(tag)
        return Response(serializer.data)

    def put(self, request, pk):
        tag = get_object_or_404(Tag, pk=pk)
        serializer = TagSerializer(tag, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tag = get_object_or_404(Tag, pk=pk)
        tag.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





class PostList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        search_term = request.GET.get('SearchTerm', '')
        per_pages = int(request.GET.get('PerPages', 3))
        page_number = int(request.GET.get('PageNum', 1))
        is_mine = request.GET.get('isMine', 'false') == 'true'
        user_email = request.GET.get('UserEmail', None)
        sort_by = request.GET.get('SortBy', 'latest')  # 추가된 부분: 정렬 기준
        user = request.user if request.user.is_authenticated else None
        

        post_list = Post.objects.all()

        if search_term:
            post_list = post_list.filter(Q(title__icontains=search_term) | Q(content__icontains=search_term))
        #특정 사용자 필터링
        if user_email:
            user_filter = get_object_or_404(User, email=user_email)
            post_list = post_list.filter(user=user_filter)
        elif is_mine and user:
            post_list = post_list.filter(user=user)
        paginator = Paginator(post_list, per_pages)

        try:
            posts = paginator.page(page_number)
        except PageNotAnInteger:
            posts = paginator.page(1)
        except EmptyPage:
            posts = paginator.page(paginator.num_pages)

        serializer = PostSerializer(posts, many=True)

        # 정렬 추가!
        if sort_by == 'latest':
            post_list = post_list.order_by('-created_at')
        elif sort_by == 'relevance' and search_term:
            post_list = post_list.annotate(
                search_rank=(
                    Q(title__icontains=search_term) * 2 +
                    Q(content__icontains=search_term)
                )
            ).order_by('-search_rank', '-created_at')
        else:
            post_list = post_list.order_by('-created_at')

        paginator = Paginator(post_list, per_pages)

        try:
            posts = paginator.page(page_number)
        except PageNotAnInteger:
            posts = paginator.page(1)
        except EmptyPage:
            posts = paginator.page(paginator.num_pages)

        serializer = PostSerializer(posts, many=True)

        #북마크 여부 및 본인 글인지 여부
        serialized_data = serializer.data
        if user:
            for post_data in serialized_data:
                post_id = post_data['id']
                post_data['is_bookmarked'] = Bookmark.objects.filter(user=user, post_id=post_id).exists()
                post_data['is_mine'] = post_list.filter(pk=post_id, user=user).exists()

        #총 페이지수, 전체 게시물 수
        return Response({
            'posts' : serialized_data,
            'pages' : paginator.num_pages,
            'total_count' : paginator.count
        })

    def post(self, request):
        user_id = int(request.data.get('user_id'))
        tag_id = int(request.data.get('tag_id'))
        user= get_object_or_404(User, pk =user_id)
        tag = get_object_or_404(Tag, pk = tag_id)
        
        post = Post(
        title = request.data.get('title'),
        content = request.data.get('content'),
        number = request.data.get('number') ,
        link = request.data.get('link') ,
        public = request.data.get('public'), 
        tag = tag,
        user = user
        )

        post.save()
        return Response(data = post.pk, status = status.HTTP_201_CREATED)
        
    
class PostDetail(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]  # 기본 권한을 설정하거나 다른 권한 클래스를 설정합니다.
    

    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# 특정 포스트의 코멘트보기
class CommentList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_pk):
        search_term = request.GET.get('SearchTerm', '')
        per_pages = int(request.GET.get('PerPages', 3))
        page_number = int(request.GET.get('PageNum', 1))
        is_mine = request.GET.get('isMine', 'false') == 'true'
        user_email = request.GET.get('UserEmail', None)
        user = request.user if request.user.is_authenticated else None

        post = get_object_or_404(Post, pk=post_pk)
        comment_list = Comment.objects.filter(post=post)

        if search_term:
            comment_list = comment_list.filter(Q(title__icontains=search_term) | Q(content__icontains=search_term))
        if user_email:
            user_filter = get_object_or_404(User, email=user_email)
            comment_list = comment_list.filter(user=user_filter)
        elif is_mine and user:
            comment_list = comment_list.filter(user=user)
        paginator = Paginator(comment_list, per_pages)

        try:
            comments = paginator.page(page_number)
        except PageNotAnInteger:
            comments = paginator.page(1)
        except EmptyPage:
            comments = paginator.page(paginator.num_pages)

        
        serializer = CommentSerializer(comments, many=True)
        serialized_data = serializer.data
        if user:
            for comment_list_data in serialized_data:
                comment_list_id = comment_list_data['id']
                comment_list_data['is_mine'] = comment_list.filter(pk=comment_list_id, user=user).exists()

        return Response({
            'comments': serialized_data,
            'pages': paginator.num_pages,
            'total_count': paginator.count
        })


    
# 
class CommentDetail(APIView):

    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_id = request.data.get('user')
        post_id = request.data.get('post_id')
        content = request.data.get('content')

        if not post_id or not content:
            return Response({'detail': 'post_id and content are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the post object
        post = get_object_or_404(Post, id=post_id)
        user = get_object_or_404(User, id = user_id)
        # Create a new comment
        comment = Comment.objects.create(post=post, content=content, user=user)
        
        return Response({
            'id': comment.id,
            'post_id': comment.post.id,
            'content': comment.content,
            'created_at': comment.created_at,
            'user_id': comment.user.id
        }, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment_id = request.data
        comment = get_object_or_404(Comment, pk=pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class BookmarkList(APIView):
    #user의 북마크한 리스트
    def get(self, request):
        user_id = request.GET.get("user_id")
        user = get_object_or_404(User, pk=user_id)
        if user:
            bookmarks = Bookmark.objects.filter(user=user)
            if not bookmarks.exists():
                return Response([0])
        else:
            bookmarks = Bookmark.objects.none() 
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)

class ToggleBookmark(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        user_id = request.data.get('user_id')
        post_id = request.data.get('post_id')
        
        user = get_object_or_404(User, pk=user_id)
        post = get_object_or_404(Post, pk=post_id)

        bookmark, created = Bookmark.objects.get_or_create(user=user, post=post)

        if not created:
            # 북마크가 이미 존재하면 해제 (삭제)
            bookmark.delete()
            return Response({"detail": "Bookmark removed."}, status=status.HTTP_204_NO_CONTENT)
        else:
            # 북마크가 존재하지 않으면 등록
            bookmark.is_bookmarked = True
            bookmark.save()
            return Response({"detail": "Bookmark added."}, status=status.HTTP_201_CREATED)
