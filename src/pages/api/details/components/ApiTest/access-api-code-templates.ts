
const cURL = {
  title: 'cURL',
  language: 'sh',
  code: ({ token }: Record<string, any>) => `curl --request GET \\
  --url http://path_to_your_api/ \\
  --header 'authorization: Bearer ${token?.access_token || '请填入正确的access_token'}'`,
};

const csharp = {
  title: 'C#',
  language: 'csharp',
  code: ({ token }: Record<string, any>) => `var client = new RestClient("http://path_to_your_api/");
var request = new RestRequest(Method.GET);
request.AddHeader("authorization", "Bearer ${token?.access_token || '请填入正确的access_token'}");
IRestResponse response = client.Execute(request);`,
};

const golang = {
  title: 'Golang',
  language: 'go',
  code: ({ token }: Record<string, any>) => `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)
  
func main() {
  url := "http://path_to_your_api/"

  req, _ := http.NewRequest("GET", url, nil)

  req.Header.Add("authorization", "Bearer ${token?.access_token || '请填入正确的access_token'}")

  res, _ := http.DefaultClient.Do(req)

  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)

  fmt.Println(res)
  fmt.Println(string(body))  
}`,
};

const java = {
  title: 'Java',
  language: 'java',
  code: ({ token }: Record<string, any>) => `HttpResponse<String> response = Unirest.get("http://path_to_your_api/")
  .header("authorization", "Bearer ${token?.access_token || '请填入正确的access_token'}")
  .asString();`,
};

const jQuery = {
  title: 'jQuery',
  language: 'javascript',
  code: ({ token }: Record<string, any>) => `const settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://path_to_your_api/",
  "method": "GET",
  "headers": {
    "authorization": "Bearer ${token?.access_token || '请输入正确的access_token'}"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
});`,
};

const nodejs = {
  title: 'Node.JS',
  language: 'javascript',
  code: ({ token }: Record<string, any>) => `const axios = require("axios");

const options = { 
  method: "GET",
  url: "http://path_to_your_api/",
  headers: { "authorization": "Bearer ${token?.access_token || '请输入正确的access_token'}" },
};

axios(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });`,
};

const php = {
  title: 'PHP',
  language: 'php',
  code: ({ token }: Record<string, any>) => `$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://path_to_your_api/",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "authorization: Bearer ${token?.access_token || '请输入正确的access_token'}"
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
};


const python = {
  title: 'Python',
  language: 'python',
  code: ({ token }: Record<string, any>) => `import http.client

conn = http.client.HTTPConnection("path_to_your_api")

headers = { 'authorization': "Bearer ${token?.access_token || '请输入正确的access_token'}" }

conn.request("GET", "/", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`,
};

const ruby = {
  title: 'Ruby',
  language: 'ruby',
  code: ({ token }: Record<string, any>) => `require 'uri'
require 'net/http'

url = URI("http://path_to_your_api/")

http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Get.new(url)
request["authorization"] = 'Bearer ${token?.access_token || '请输入正确的access_token'}'

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