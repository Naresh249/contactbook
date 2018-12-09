from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.Contacts.as_view(), name='contacts'),
	url(r'^user/$', views.User.as_view(), name='login'),
	url(r'^logout/$', views.user_logout, name='logout'),
	url(r'^contact-form/$', views.ContactForm.as_view(), name='logout'),
	url(r'^search/$', views.search_contact, name='search_contact'),
]