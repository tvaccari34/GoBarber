# GoBarber

# Forgot Password

**RF**
- User should be able to retrieve password informing his email;
- User should receive an email with instructions to retreive password;
- User should be able to reset password;

**RNF**
- Should use Mailtrap to test email on Dev environment;
- Should use Amazon SES to send emails on Prod;
- Send email functionality should happens in background (background job);

**RN**
- Link to reset password should expire in 1 hour
- User have to confirm new password to reset it.

# Profile Update

**RF**
- User should be able to update his profile (name, email, password);

**RN**
- User should not be able to update his email to another already used;
- User should informe his old password to update his password;
- User have to confirm new password to update password;


# Provider Dashboard
**FR**
- User should be able to list his appointments for a specific day;
- Provider should be able to receive a notification everytime when he get a new appointment;
- Provider should be able to see the unread notifications;


**NFR**
- Provider's appointment should be saved in cache;
- Provider's notifications should be kept on MongoDB;
- Provider's notifications should be sent on real time using socket.io;




**BR**
- Notification should have read and unread status, so Providers can handle it.
-

# Service Booking

**RF**
- User should be able to list all providers;
- User should be able to see the selected provider's available schedule;
- User should be able to list all available time;
- User should be able to book a time with a specific provider;

**RNF**
- Provider list should be kept in cache for a better user experience;


**RN**
- Each booking time should take 1 hour;
- The schedule should be available between 8AM to 6PM (First appointment at 8AM and Last appointment at 5PM);
- User should not be able to make an appointment on the same time already booked;
- User should not be able to make an appointment on the past;
- User should not be able to make an appointment with himself;