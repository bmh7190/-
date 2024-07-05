from django.urls import path
from .views import *
urlpatterns = [

    path('tags/', TagList.as_view(), name='tag-list'),
    path('tags/<int:pk>/', TagDetail.as_view(), name='tag-detail'),

    path('posts/<int:post_pk>', PostList.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),

    path('comments/', CommentList.as_view(), name='comment-list'),
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),

    path('bookmarks/', BookmarkList.as_view(), name='bookmark-list'),
    path('bookmarks/<int:pk>/', BookmarkDetail.as_view(), name='bookmark-detail'),
]
