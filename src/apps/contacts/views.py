import copy

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db import transaction
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import View

from contacts.models import *
from contacts import serializers as contact_serializer
from contacts import utils as contact_utils

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
		data = contact_utils.fetch_user_contacts(request.user.id)
		page = request.GET.get('page', 1)
		paginator = Paginator(data, 10) # 10 records per page
		
		try:
			contacts = paginator.page(page)
		except PageNotAnInteger:
			contacts = paginator.page(1)
		except EmptyPage:
			contacts = paginator.page(paginator.num_pages)
		
		return render(
			request, template_name,
			context={'BASE_URL': settings.BASE_URL, 'contacts': contacts})

	@method_decorator(login_required)
	def post(self, request):
		""" Adding a new contact"""
		template_name = 'dashboard.html'
		param = copy.deepcopy(request.POST)
		context = {
			'BASE_URL': settings.BASE_URL
		}
		contact_request_validator = contact_serializer.ContactDetailsSerializer(data=param)
		if not contact_request_validator.is_valid():
			template_name = 'contact_form.html'
			context['error'] = contact_request_validator.errors
			return render(request, template_name, context=context)
		# Opening  a transaction
		with transaction.atomic():
			contact_details_params = contact_request_validator.validated_data
			email_id = contact_details_params.pop('email', None)
			# Fetching contach if not available creating
			contact, created = Contact.objects.get_or_create(email=email_id, is_deleted=False)
			contact_details_params['contact'] = contact
			# Creating Contact Deatils
			contact_details = ContactDetails.objects.create(**contact_details_params)
			# Creating Mapping Contact Details and User
			UserContactMapping.objects.create(
				user_id=request.user.id, contact_details_id=contact_details.id)
		
		# Fetching data for dashboard
		data = contact_utils.fetch_user_contacts(request.user.id)
		paginator = Paginator(data, 10)
		context['contacts'] = paginator.page(1)
		context['message'] = 'Sucessfully Created Contact!'
		return render(request, template_name, context=context)

	@method_decorator(login_required)
	def put(self, request):
		""" Editing a existing contact"""
		template_name = 'dashboard.html'
		return render(request, template_name, context)

	@method_decorator(login_required)
	def delete(self, request):
		""" Deleting a contact"""
		template_name = 'dashboard.html'
		contact_details_id = request.body.decode().split("=")[1]
		# Deleting mapping
		UserContactMapping.objects.filter(
			contact_details_id=contact_details_id).update(is_deleted=True)

		# Need to fetch data here and return in the context so that it could be binded with page
		data = contact_utils.fetch_user_contacts(request.user.id)
		paginator = Paginator(data, 10)
		context = {}
		context['delete_msg'] ='Sucessfully Deleted Contact.'
		context['contacts'] = paginator.page(1)
		return render(request, template_name, context=context)


class User(View):
	"""
	User Management
	"""
	def get(self, request):
		"""
		Rendering User Login Form
		"""
		template_name = 'login.html'
		context = {'BASE_URL': settings.BASE_URL}
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
		data = contact_utils.fetch_user_contacts(request.user.id)
		paginator = Paginator(data, 10)
		contacts = paginator.page(1)

		return render(
				request, template_name, context={
					'BASE_URL': settings.BASE_URL, 'contacts': contacts})

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

class ContactForm(View):
	"""
	Contact Form 
	"""
	@method_decorator(login_required)
	def get(self, request):
		"""
		Rendering Contact Form
		"""
		template_name = 'contact_form.html'
		relationship = Relationship.objects.filter(is_deleted=False).order_by('name')
		relationship_data = contact_serializer.GetRelationshipSerializer(
			relationship, many=True).data

		context = {
			'BASE_URL': settings.BASE_URL,
			'data': relationship_data}
		return render(request, template_name, context=context)