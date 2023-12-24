
const cURL = {
  title: 'cURL',
  language: 'sh',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `curl --request POST \
  --url https://${tenant.name}.${tenant.region}.authok.cn/oauth/token \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"${application.client_id}","client_secret":"${application.client_secret}","audience":"${ resourceServer.identifier}","grant_type":"client_credentials"}'`,
};

const csharp = {
  title: 'C#',
  language: 'csharp',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `var client = new RestClient("https://${tenant.name}.${tenant.region}.authok.cn/oauth/token");
var request = new RestRequest(Method.POST);
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);`,
}

const golang = {
  title: 'Golang',
  language: 'go',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `package main
import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)
  
func main() {  
  url := "https://${tenant.name}.${tenant.region}.authok.cn/oauth/token"
  payload := strings.NewReader("{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}")  
  req, _ := http.NewRequest("POST", url, payload)
  req.Header.Add("content-type", "application/json")
  res, _ := http.DefaultClient.Do(req)
  
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)
  
  fmt.Println(res)
  fmt.Println(string(body))
}`,
}


const java = {
  title: 'Java',
  language: 'java',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `HttpResponse<String> response = Unirest.post("https://${tenant.name}.${tenant.region}.authok.cn/oauth/token")
  .header("content-type", "application/json")
  .body("{\\"client_id\\":\\"${application.client_id}\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}")
  .asString();`,
}

const jQuery = {
  title: 'jQuery',
  language: 'javascript',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `const settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://${tenant.name}.${tenant.region}.authok.cn/oauth/token",
  "method": "POST",
  "headers": {
    "content-type": "application/json"
  },
  "data": "{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});`,
}

const nodejs = {
  title: 'Node.JS',
  language: 'javascript',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `const axios = require("axios");

axios.post(
  'https://${tenant.name}.${tenant.region}.authok.cn/oauth/token',
  {
    "client_id": "${application.client_id}",
    "client_secret": "${application.client_secret}",
    "audience": "${resourceServer.identifier}",
    "grant_type": "client_credentials",
  },
).then(response => {
  console.log(response.data);
});`,
}


const php = {
  title: 'PHP',
  language: 'php',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://${tenant.name}.${tenant.region}.authok.cn/oauth/token",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}",
  CURLOPT_HTTPHEADER => array(
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`,
}


const python = {
  title: 'Python',
  language: 'python',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `import http.client

conn = http.client.HTTPSConnection("${tenant.name}.${tenant.region}.authok.cn")

payload = "{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}"

headers = { 'content-type': "application/json" }

conn.request("POST", "/oauth/token", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`,
}

const ruby = {
  title: 'Ruby',
  language: 'ruby',
  code: ({ tenant, application, resourceServer }: Record<string, any>) => `require 'uri'
require 'net/http'

url = URI("https://${tenant.name}.${tenant.region}.authok.cn/oauth/token")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Post.new(url)
request["content-type"] = 'application/json'
request.body = "{\\"client_id\\":\\"${application.client_id}\\",\\"client_secret\\":\\"${application.client_secret}\\",\\"audience\\":\\"${resourceServer.identifier}\\",\\"grant_type\\":\\"client_credentials\\"}"

response = http.request(request)
puts response.read_body`,
};

export default [
  cURL,
  csharp,
  golang,
  java,
  jQuery,
  nodejs,
  php,
  python,
  ruby,
];