from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from imagekitio.models.CreateFolderRequestOptions import CreateFolderRequestOptions
from dotenv import load_dotenv
from pathlib import Path
import os
import base64

load_dotenv(Path(".././.env"))

imagekit = ImageKit(
    private_key=os.getenv("VARIABLE_1"), 
    public_key=os.getenv("VARIABLE_2"),
    url_endpoint=os.getenv("URL_ENDPOINT"),
)

class FileUploads:
    
    def create_user_folder(username):
        imagekit.create_folder(options=CreateFolderRequestOptions(folder_name=str(username), parent_folder_path='/Users'))
        imagekit.create_folder(options=CreateFolderRequestOptions(folder_name='Images', parent_folder_path='/Users/' + str(username)))
        imagekit.create_folder(options=CreateFolderRequestOptions(folder_name='Riffs', parent_folder_path='/Users/' + str(username)))

    def upload_image(image, username):
        upload_status = imagekit.upload_file(
            file=base64.b64encode(image.read()),  # required
            file_name=image.filename,  # required
            options=UploadFileRequestOptions(folder='/Users/'+ str(username) + '/Images/')
        )
        return upload_status

    def upload_audio(audio, username):
        upload_status = imagekit.upload_file(
            file=base64.b64encode(audio.read()), # required
            file_name=audio.filename,  # required
            options=UploadFileRequestOptions(folder='/Users/'+ str(username) + '/Riffs/')
        )
        return upload_status

    def purge_image(image_id):
        purge_status = imagekit.delete_file(image_id)
        return purge_status
