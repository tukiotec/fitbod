import urllib.request
import json
import time
import subprocess
import re

# 1. Get domain
req = urllib.request.Request('https://api.mail.tm/domains', headers={'User-Agent': 'Mozilla/5.0'})
domains = json.loads(urllib.request.urlopen(req).read().decode())
domain = domains['hydra:member'][0]['domain']

rand_user = 'aresgym' + str(int(time.time()))[-5:]
email = f'{rand_user}@{domain}'
password = 'AresMasterPassword2026!'

# 2. Create account
acc_data = json.dumps({'address': email, 'password': password}).encode('utf-8')
req = urllib.request.Request('https://api.mail.tm/accounts', data=acc_data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
urllib.request.urlopen(req)

# 3. Get mail token
req = urllib.request.Request('https://api.mail.tm/token', data=acc_data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
token_res = json.loads(urllib.request.urlopen(req).read().decode())
mail_token = token_res['token']
print('Created Mail Account:', email)

# 4. Request Surge Token via Node script
node_script = f"""
const surgeSDK = require('C:/Users/AT PC/AppData/Local/npm-cache/_npx/23158936acd5c32d/node_modules/surge-sdk');
const sdk = surgeSDK({{ endpoint: 'https://surge.surge.sh' }});
sdk.token({{ user: '{email}', pass: '{password}' }}, {{ msg: 'verify flow' }}, (err, res) => {{
  if (err) {{
    console.error('SDK ERR:', err);
  }} else {{
    console.log('SURGE_TOKEN:' + res.pass);
  }}
}});
"""
with open('temp_sdk.js', 'w', encoding='utf-8') as f:
    f.write(node_script)

proc = subprocess.Popen(['node', 'temp_sdk.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
stdout, stderr = proc.communicate()
print('Node output:', stdout, stderr)

surge_token = None
for line in stdout.splitlines():
    if line.startswith('SURGE_TOKEN:'):
        surge_token = line.split(':', 1)[1].strip()

print('Surge Token:', surge_token)

# 5. Set credentials in creds.js
setup_creds = f"""
const localCreds = require('C:/Users/AT PC/AppData/Local/npm-cache/_npx/23158936acd5c32d/node_modules/surge/lib/util/creds.js');
const parse = require('C:/Users/AT PC/AppData/Local/npm-cache/_npx/23158936acd5c32d/node_modules/url-parse-as-address');
const endpoint = parse('surge.surge.sh');
localCreds(endpoint).set('{email}', '{surge_token}');
console.log('Credentials updated in local store');
"""
with open('temp_sdk.js', 'w', encoding='utf-8') as f:
    f.write(setup_creds)
subprocess.run(['node', 'temp_sdk.js'])

# 6. Request verify email
print('Calling surge verify...')
verify_proc = subprocess.Popen(['npx.cmd', 'surge', 'verify'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
vout, verr = verify_proc.communicate()
print('Surge verify output:', vout)

# 7. Poll mail.tm for verification email
print('Waiting for verification email from Surge...')
verify_link = None
for attempt in range(15):
    time.sleep(2)
    req = urllib.request.Request('https://api.mail.tm/messages', headers={'Authorization': f'Bearer {mail_token}', 'User-Agent': 'Mozilla/5.0'})
    res = json.loads(urllib.request.urlopen(req).read().decode())
    messages = res.get('hydra:member', [])
    print(f'Attempt {attempt+1}: {len(messages)} message(s)')
    if messages:
        msg_id = messages[0]['id']
        req2 = urllib.request.Request(f'https://api.mail.tm/messages/{msg_id}', headers={'Authorization': f'Bearer {mail_token}', 'User-Agent': 'Mozilla/5.0'})
        msg_data = json.loads(urllib.request.urlopen(req2).read().decode())
        body = msg_data.get('text', '') or msg_data.get('html', [''])[0]
        print('Message Subject:', msg_data.get('subject'))
        links = re.findall(r'https?://[^\s<>"\']+', body)
        for link in links:
            if 'verify' in link:
                verify_link = link
                break
        if verify_link:
            break

print('Verification Link found:', verify_link)
if verify_link:
    req_v = urllib.request.Request(verify_link, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_v) as v_res:
        print('Verification click status:', v_res.status)
        print('VERIFIED SUCCESSFULLY!')
