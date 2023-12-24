export default `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;font-family: &quot;ProximaNova&quot;, sans-serif;height: 100% !important;"><center>
  <table style="width: 600px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 0;font-family: &quot;ProximaNova&quot;, sans-serif;border-collapse: collapse !important;height: 100% !important;" align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
    <tr>
      <td align="center" valign="top" id="bodyCell" style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 20px;font-family: &quot;ProximaNova&quot;, sans-serif;height: 100% !important;">
      <div class="main">
        <!-- Email change content -->
        {% if operation == 'change_email' %}

          <p style="font-size: 1.2em;line-height: 1.3;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">Your email address has been updated.</p>

        {% else %}

          <!-- Signup email content -->
          {% if send == 'link' or send == 'link_ios' or send == 'link_android' %}

            <p style="font-size: 1.2em;line-height: 1.3;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">Click and confirm that you want to sign in to {{ application.name }}. This link will expire in three minutes.</p>

            <div style="text-align:center">
            <a id="signIn" style="text-transform: uppercase;letter-spacing: 1px;color: #ffffff;text-decoration: none;display: inline-block;min-height: 48px;line-height: 48px;padding-top: 0;padding-right: 26px;padding-bottom: 0;margin: 20px 0;padding-left: 26px;border: 0;outline: 0;background: #eb5424;font-size: 14px;font-style: normal;font-weight: 400;text-align: center;white-space: nowrap;border-radius: 3px;text-overflow: ellipsis;max-width: 280px;overflow: hidden;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;" href="{{ link }}">Sign in to {{ application.name }}</a>
            </div>

            <p style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">Or sign in using this link:</p>
            <p style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;"><a style="font-size: 12px; color: #A9B3BC; text-decoration: none;word-break: break-all;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;" href="{{ link }}">{{ link }}</a></p>

            {% elsif send == 'code' %}

            <p style="font-size: 1.4em; line-height: 1.3;">您的验证码是: <b>{{ code }}</b></p>

          {% endif %}

        {% endif %}

        <strong>{{ application.name }}</strong>

        <br><br>
        <hr style="border: 2px solid #EAEEF3; border-bottom: 0; margin: 20px 0;">
      </div>
      </td>
    </tr>
  </table>
</center>
</body>
</html>`;