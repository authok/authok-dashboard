
const reset_email = `<html>
<head>
</head>
<body>
  <center>
    <table
      style='width: 600px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 0;font-family: "ProximaNova", sans-serif;border-collapse: collapse !important;height: 100% !important;'
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      height="100%"
      width="100%"
      id="bodyTable"
    >
      <tr>
        <td
          align="center"
          valign="top"
          id="bodyCell"
          style='-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 20px;font-family: "ProximaNova", sans-serif;height: 100% !important;'
        >
          <div class="main">
            <p
              style="text-align: center;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%; margin-bottom: 30px;"
            >
              <img
                src="badge.png"
                width="50"
                alt="Your logo goes here"
                style="-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
              />
            </p>

            <h1>Password Change Request</h1>

            <p>You have submitted a password change request.</p>

            <p>
              If it wasn't you please disregard this email and make sure you can still login to your account. If it
              was you, then <strong>confirm the password change <a href="{{ url }}">click here</a></strong
              >.
            </p>

            <br />
            Thanks!
            <br />

            <strong>{{ application.name }}</strong>

            <br /><br />
            <hr style="border: 2px solid #EAEEF3; border-bottom: 0; margin: 20px 0;" />
            <p style="text-align: center;color: #A9B3BC;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">
              If you did not make this request, please contact us by replying to this mail.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;

const welcome_email = `<html>
<head>
</head>
<body>
  <center>
    <table
      style='width: 600px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 0;font-family: "ProximaNova", sans-serif;border-collapse: collapse !important;height: 100% !important;'
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      height="100%"
      width="100%"
      id="bodyTable"
    >
      <tr>
        <td
          align="center"
          valign="top"
          id="bodyCell"
          style='-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0;padding: 20px;font-family: "ProximaNova", sans-serif;height: 100% !important;'
        >
          <div class="main">
            <p
              style="text-align: center;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%; margin-bottom: 30px;"
            >
              <img
                src="badge.png"
                width="50"
                alt="Your logo goes here"
                style="-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
              />
            </p>

            <h1>Welcome to {{ application.name }}!</h1>

            <p>
              If you are having any issues with your account, please don't hesitate to contact us by replying to
              this mail.
            </p>

            <br />
            Thanks!
            <br />

            <strong>{{ application.name }}</strong>

            <br /><br />
            <hr style="border: 2px solid #EAEEF3; border-bottom: 0; margin: 20px 0;" />
            <p style="text-align: center;color: #A9B3BC;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;">
              If you did not make this request, please contact us by replying to this mail.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;

export default {
  reset_email,
  welcome_email
};