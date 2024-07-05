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
    post_id = serializers.IntegerField()
    content = serializers.CharField(max_length=200)

    def create(self, validated_data):
        """
        Create and return a new Comment instance, given the validated data.
        """
        return Comment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Comment instance, given the validated data.
        """
        instance.post_id = validated_data.get('post_id', instance.post_id)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance