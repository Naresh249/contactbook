from django.conf import settings

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import View


class Contacts(View):
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

	@method_decorator(login_required)
	def post(self, request):
		""" Adding a new contact"""
		template_name = 'dashboard.html'
		return render(request, template_name, context)

	@method_decorator(login_required)
	def put(self, request):
		""" Editing a existing contact"""
		template_name = 'dashboard.html'
		return render(request, template_name, context)

	@method_decorator(login_required)
	def delete(self, request):
		""" Deleting a contact"""
		template_name = 'dashboard.html'
		return render(request, template_name, context)


class User(View):
	"""
	User Management
	"""
	def get(self, request):
		"""
		Rendering User Login Form
		"""
		template_name = 'login.html'
		context = {}
		return render(
				request, template_name, context = context
			)

	def post(self, request):
		"""
		User Login 
		"""
		template_name = 'login.html'
		request_data = request.POST
		is_valid_user = authenticate(
				username=request_data.get('username'), password=request_data.get('password'))
		if not is_valid_user:
			context = {'error': 'Invalid Username/Password!'}
			return render(
					request, template_name, context=context
				)
		login(request, is_valid_user)
		template_name = 'dashboard.html'
		# Need to fetch data here and return in the context so that it could be binded with page
		return render(
				request, template_name)

@login_required
def user_logout(request):
	"""
	Logging out user
	"""
	template_name = 'login.html'
	logout(request)
	return render(
		request, template_name, 
		context={'BASE_URL': settings.BASE_URL, 'message': 'User Sucessfully Logout!'})