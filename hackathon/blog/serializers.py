from rest_framework import serializers, viewsets
from .models import Tag, Post, Comment,Bookmark

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'

class CommentSerializer2(serializers.Serializer):
    user = serializers.ReadOnlyField(source='user.username')
    post_id = serializers.IntegerField(write_only=True)  # post_id를 write-only 필드로 추가합니다.

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'updated_at', 'user', 'post_id']