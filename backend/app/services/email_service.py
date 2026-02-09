import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config.settings import get_settings

settings = get_settings()


class EmailService:
    """Service for sending emails via SMTP"""
    
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL
        self.support_email = settings.SUPPORT_EMAIL
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        body_html: str,
        body_text: Optional[str] = None,
        reply_to: Optional[str] = None
    ) -> bool:
        """Send an email via SMTP"""
        try:
            # Use SMTP username as sender if configured (required for Gmail)
            sender_email = self.smtp_username if self.smtp_username else self.from_email
            
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = sender_email
            msg["To"] = to_email
            
            if reply_to:
                msg["Reply-To"] = reply_to
            
            # Plain text version
            if body_text:
                part1 = MIMEText(body_text, "plain")
                msg.attach(part1)
            
            # HTML version
            part2 = MIMEText(body_html, "html")
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.sendmail(sender_email, to_email, msg.as_string())
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False
    
    def send_support_ticket_notification(
        self,
        ticket_id: int,
        user_email: str,
        user_name: str,
        message: str,
        session_id: str
    ) -> bool:
        """Notify support team about a new ticket"""
        subject = f"[Nexus Support #{ticket_id}] New support request from {user_name}"
        
        body_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 30px; border: 1px solid #ff6b00; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .header h1 {{ color: #ff6b00; margin: 0; }}
                .ticket-info {{ background: rgba(255, 107, 0, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .ticket-info p {{ margin: 8px 0; }}
                .label {{ color: #ff9e00; font-weight: bold; }}
                .message {{ background: #0a0a0a; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #ff6b00; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
                .btn {{ display: inline-block; background: linear-gradient(135deg, #ff6b00, #ff9e00); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎫 New Support Ticket</h1>
                </div>
                
                <div class="ticket-info">
                    <p><span class="label">Ticket ID:</span> #{ticket_id}</p>
                    <p><span class="label">From:</span> {user_name} ({user_email})</p>
                    <p><span class="label">Session:</span> {session_id}</p>
                </div>
                
                <div class="message">
                    <p><span class="label">Message:</span></p>
                    <p>{message}</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="mailto:{user_email}?subject=Re: [Nexus Support #{ticket_id}]" class="btn">
                        Reply to Customer
                    </a>
                </div>
                
                <div class="footer">
                    <p>This is an automated notification from Nexus Support System</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        body_text = f"""
        New Support Ticket #{ticket_id}
        
        From: {user_name} ({user_email})
        Session: {session_id}
        
        Message:
        {message}
        
        Reply to: {user_email}
        """
        
        return self.send_email(
            to_email=self.support_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            reply_to=user_email
        )
    
    def send_ticket_confirmation(
        self,
        ticket_id: int,
        user_email: str,
        user_name: str
    ) -> bool:
        """Send confirmation email to user about their support request"""
        subject = f"[Nexus Support #{ticket_id}] We received your request!"
        
        body_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 30px; border: 1px solid #ff6b00; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .header h1 {{ color: #ff6b00; margin: 0; }}
                .content {{ line-height: 1.8; }}
                .ticket-id {{ background: linear-gradient(135deg, #ff6b00, #ff9e00); color: #000; padding: 15px 25px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Got it!</h1>
                </div>
                
                <div class="content">
                    <p>Hey {user_name}! 👋</p>
                    <p>Thanks for reaching out! Our support team has received your message and will get back to you shortly.</p>
                    
                    <div class="ticket-id">
                        Ticket #{ticket_id}
                    </div>
                    
                    <p>Keep this ticket number for your reference. Our average response time is under 2 hours during business hours.</p>
                    <p>In the meantime, you can check out our <a href="https://nexus.com/help" style="color: #ff6b00;">Help Center</a> for quick answers!</p>
                </div>
                
                <div class="footer">
                    <p>— The Nexus Team 🚀</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        body_text = f"""
        Hey {user_name}!
        
        Thanks for reaching out! We've received your support request.
        
        Your Ticket ID: #{ticket_id}
        
        Our team will get back to you shortly. Average response time is under 2 hours.
        
        — The Nexus Team
        """
        
        return self.send_email(
            to_email=user_email,
            subject=subject,
            body_html=body_html,
            body_text=body_text
        )


# Global email service instance
email_service = EmailService()
