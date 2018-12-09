from contacts import models as contact_models
from contacts import serializers as contact_serializer

def fetch_user_contacts(user_id):
	"""
	Fetching User Contacts
	params - user_id
	return data
	"""
	user_contacts = contact_models.UserContactMapping.objects.filter(
			user_id=user_id, is_deleted=False).select_related('contact_details').order_by('-created_at')
	user_contacts = contact_serializer.FetchContactDetailsSerializers(
		user_contacts, many=True).data

	return user_contacts