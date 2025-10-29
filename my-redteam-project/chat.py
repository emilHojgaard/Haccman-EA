
def call_api(prompt, options, context):
    return {"output": "ok"}

# # Custom provider for red teaming
# # Docs: https://promptfoo.dev/docs/red-team/configuration/#providers

# import http.client
# import urllib.parse
# import json

# def call_api(prompt, options, context):
#     parsed_url = urllib.parse.urlparse('https://hacc-man.netlify.app/play2?sid=7c87f285-5ca9-436e-aada-4ca41056f5dd')
#     conn = http.client.HTTPSConnection(parsed_url.netloc)

#     headers = {'Content-Type': 'application/json'}
#     payload = json.dumps({'user_chat': prompt})

#     conn.request("POST", parsed_url.path or "/", body=payload, headers=headers)
#     response = conn.getresponse()

#     return {
#       "output": response.read().decode()
#     }
