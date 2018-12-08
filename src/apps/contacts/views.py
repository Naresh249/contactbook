from django.conf import settings

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import View

class Dashboard(View):
	"""
	Contact Details Dashboard where user can manage the contacts
	"""
	@method_decorator(login_required)
	def get(self, request):
		"""
		Fetching the requested details of logged in user
		"""
		template_name = 'dashboard.html'
		data = {}
		return render(
			request, template_name,
			context={'BASE_URL': settings.BASE_URL, 'data': data})


class User(View):
	"""
	User Management
	"""
	def get(self, request):
		"""
		Rendering User Login Form
		"""
		template_name = 'login.html'
		return render(
				request, template_name,
				context = {'BASE_URL': settings.BASE_URL}
			)