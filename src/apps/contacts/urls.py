from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.Dashboard.as_view(), name='dashboard'),
	url(r'^user/$', views.User.as_view(), name='login'),
]