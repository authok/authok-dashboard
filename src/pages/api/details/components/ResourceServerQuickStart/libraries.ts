const express = {
  name: 'Node.js(Express)',
  language: 'javascript',
  code: (params: Record<string, any>) => `var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
  
var port = process.env.PORT || 8080;
  
var jwtCheck = jwt({
secret: jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://${params.tenant.name}.${params.tenant.region}.authok.cn/.well-known/jwks.json'
}),
audience: '${params.resourceServer.identifier}',
issuer: 'https://${params.tenant.name}.${params.tenant.region}.authok.cn/',
algorithms: ['RS256']
});
  
app.use(jwtCheck);
  
app.get('/authorized', function (req, res) {
res.send('Secured Resource');
});
  
app.listen(port);
`, 
};

const csharp = {
  name: 'C#',
  language: 'csharp',
  code: (params: Record<string, any>) => `public class Startup
{
  public void ConfigureServices(IServiceCollection services)
  {
    services.AddMvc();
  
    // 1. Add Authentication Services
    services.AddAuthentication(options =>
    {
      options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
      {
        options.Authority = "https://${params.tenant.name}.${params.tenant.region}.authok.cn/";
        options.Audience = "${params.resourceServer.identifier}";
      });
  }
  
  public void Configure(IApplicationBuilder app, IHostingEnvironment env)
  {
      if (env.IsDevelopment())
      {
          app.UseDeveloperExceptionPage();
      }
      else
      {
          app.UseExceptionHandler("/Home/Error");
      }
  
      app.UseStaticFiles();
  
      // 2. Enable authentication middleware
      app.UseAuthentication();
  
      app.UseMvc(routes =>
      {
          routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
      });
  }
}`,
};

const java = {
  name: 'Java(Spring)',
  language: 'java',
  code: (params: Record<string, any>) => `
`,
};

const php = {
  name: 'PHP',
  language: 'php',
  code: ({ resourceServer, tenant }: Record<string, any>) => `
use Authok\SDK\JWTVerifier;
use Authok\SDK\Helpers\Cache\FileSystemCacheHandler;

$verifier = new JWTVerifier([
    'valid_audiences' => ['${resourceServer.identifier}'],
    'authorized_iss' => ['https://${tenant.name}.${tenant.region}.authok.cn'],
    'cache' => new FileSystemCacheHandler() // 可选参数. By default no cache is used to fetch the JSON Web Keys.
]);

$decoded = $verifier->verifyAndDecode($token);
`,
};

const golang = {
  name: 'Golang(Gin)',
  language: 'go',
  code: (params: Record<string, any>) => `
type Order {
  Name string;
} 
`,
};

const python = {
  name: 'Python',
  language: 'python',
  code: (params: Record<string, any>) => `
`,
};


export default [
  express,
  java,
  csharp,
  php,
  golang,
  python,
]