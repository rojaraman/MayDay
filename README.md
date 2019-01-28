### Search management microservice codenamed: Blue

### Make sure you have isolated python environment 
execute following command

virtual .venv

### To Run the code
### waitress-serve --port=PORT MODULE:OBJECT
waitress-serve --port=8000 server.app:api

### GET response
http://localhost:8000/search/recent

Sample Resposne:
{
    "recent_doctor_result": [
        {
            "rating": "5",
            "doctor_id": "01",
            "specialisation": "Neurologist",
            "id": 0,
            "doctor": "John Doe"
        },
        {
            "rating": "5",
            "doctor_id": "02",
            "specialisation": "Cardiologist",
            "id": 1,
            "doctor": "Abc Def"
        },
        {
            "rating": "5",
            "doctor_id": "03",
            "specialisation": "ENT",
            "id": 1,
            "doctor": "Xyz xyz"
        }
    ]
}

### POST request
http://localhost:8000/search/recent
Sample request
{
	"userid" : 1
}

Sample response
{
    "message": "OK",
    "code": 200,
    "userid": {
        "userid": 1
    }
}
