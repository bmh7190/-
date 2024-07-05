from django.urls import path
from .views import *
urlpatterns = [

    path('tags/', TagList.as_view(), name='tag-list'),
    path('tags/<int:pk>/', TagDetail.as_view(), name='tag-detail'),

    path('posts/', PostList.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),

    path('comments/<int:post_pk>', CommentList.as_view(), name='comment-list'),
    path('comments/', CommentDetail.as_view(), name='comment-detail'),

    path('bookmarks/', BookmarkList.as_view(), name='bookmark-list'),
    path('bookmarks/toggle/', ToggleBookmark.as_view(), name='bookmark-toggle'),
]
