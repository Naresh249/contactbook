import re

from rest_framework import serializers

from contacts.models import *

class GetRelationshipSerializer(serializers.ModelSerializer):
	"""
	Fetching Relationship data
	"""
	class Meta:
		model = Relationship
		fields = ('id' ,'name')

class ContactDetailsSerializer(serializers.ModelSerializer):
	"""
	Validating contact details request params
	"""
	contact = serializers.IntegerField(required=False)
	email = serializers.CharField(max_length=255)

	def validate(self, data):
		"""
		Validating Email Pattern
		"""
		req = re.compile('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
		if data.get('email') and not req.match(data.get('email')):
			raise serializers.ValidationError('Please Provide Valid Email Id.')
		
		return data

	class Meta:
		model = ContactDetails
		fields = '__all__'

class GetContactDetailsSerializer(serializers.ModelSerializer):
	"""
	Fetching User ContactDetails 
	"""
	email = serializers.SerializerMethodField(required=False)
	relationship = serializers.SerializerMethodField(required=False)

	def get_email(self, data):
		return data.contact.email

	def get_relationship(self, data):
		return data.relationship.name

	class Meta:
		model = ContactDetails
		fields = ('id', 'contact_id', 'email', 'name',
					'primary_mobile_number', 'secondary_mobile_number',
					'company_name', 'occupation', 'relationship', 'relationship_id',
					'address', 'landmark', 'city', 'pincode', 'state',)

class FetchContactDetailsSerializers(serializers.ModelSerializer):
	"""
	Fetching User Contact Details
	"""
	contact_details = GetContactDetailsSerializer()
	created_at = serializers.SerializerMethodField()

	def get_created_at(self, data):
		return data.created_at.strftime('%Y-%m-%d')

	class Meta:
		model = UserContactMapping
		fields = ('contact_details','created_at')