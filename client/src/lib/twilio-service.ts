// Twilio SMS service for field service providers
export interface SMSMessage {
  to: string;
  message: string;
  type: 'lead_followup' | 'appointment_confirmation' | 'service_notification' | 'emergency_alert' | 'review_request';
}

export interface SMSTemplate {
  type: string;
  template: string;
  description: string;
}

export class TwilioService {
  // Send SMS message
  async sendSMS(smsData: SMSMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData),
      });

      if (!response.ok) {
        throw new Error(`SMS failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('SMS send error:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  // Send automated lead follow-up
  async sendLeadFollowup(phoneNumber: string, leadName: string, businessName: string): Promise<{ success: boolean; error?: string }> {
    const message = `Hi ${leadName}! Thanks for your interest in ${businessName}. We'll contact you within 24 hours to discuss your service needs. Reply STOP to opt out.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'lead_followup'
    });
  }

  // Send appointment confirmation
  async sendAppointmentConfirmation(phoneNumber: string, customerName: string, appointmentDate: string, serviceType: string): Promise<{ success: boolean; error?: string }> {
    const message = `Hi ${customerName}, your ${serviceType} appointment is confirmed for ${appointmentDate}. We'll text you when our technician is on the way. Reply STOP to opt out.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'appointment_confirmation'
    });
  }

  // Send technician arrival notification
  async sendTechnicianUpdate(phoneNumber: string, customerName: string, technicianName: string, estimatedArrival: string): Promise<{ success: boolean; error?: string }> {
    const message = `Hi ${customerName}, ${technicianName} is on the way and should arrive around ${estimatedArrival}. Call us at (555) 123-4567 with any questions.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'service_notification'
    });
  }

  // Send emergency alert
  async sendEmergencyAlert(phoneNumber: string, customerName: string, alertMessage: string): Promise<{ success: boolean; error?: string }> {
    const message = `URGENT - ${customerName}: ${alertMessage} Please call us immediately at (555) 123-4567 for assistance.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'emergency_alert'
    });
  }

  // Send review request
  async sendReviewRequest(phoneNumber: string, customerName: string, businessName: string, reviewLink: string): Promise<{ success: boolean; error?: string }> {
    const message = `Hi ${customerName}, thanks for choosing ${businessName}! We'd love your feedback: ${reviewLink} Reply STOP to opt out.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'review_request'
    });
  }

  // Get SMS templates for different scenarios
  getSMSTemplates(): SMSTemplate[] {
    return [
      {
        type: 'lead_followup',
        template: 'Hi {customerName}! Thanks for your interest in {businessName}. We\'ll contact you within 24 hours to discuss your {serviceType} needs.',
        description: 'Automatic response to new leads from website forms'
      },
      {
        type: 'appointment_confirmation',
        template: 'Hi {customerName}, your {serviceType} appointment is confirmed for {appointmentDate}. We\'ll text you when our technician is on the way.',
        description: 'Sent when appointments are scheduled'
      },
      {
        type: 'technician_enroute',
        template: 'Hi {customerName}, {technicianName} is on the way and should arrive around {estimatedTime}. Call us at {businessPhone} with questions.',
        description: 'Sent when technician leaves for appointment'
      },
      {
        type: 'service_complete',
        template: 'Hi {customerName}, your {serviceType} service is complete. Thanks for choosing {businessName}! Any questions? Call {businessPhone}.',
        description: 'Sent when service work is finished'
      },
      {
        type: 'review_request',
        template: 'Hi {customerName}, thanks for choosing {businessName}! We\'d love your feedback: {reviewLink}',
        description: 'Sent 24 hours after service completion'
      },
      {
        type: 'emergency_alert',
        template: 'URGENT - {customerName}: {alertMessage} Please call us immediately at {businessPhone} for assistance.',
        description: 'For urgent notifications about emergencies or critical issues'
      },
      {
        type: 'weather_delay',
        template: 'Hi {customerName}, due to severe weather, your {appointmentDate} appointment may be delayed. We\'ll update you soon.',
        description: 'Sent when weather conditions affect scheduling'
      },
      {
        type: 'payment_reminder',
        template: 'Hi {customerName}, friendly reminder: your {serviceType} invoice is due. Pay online at {paymentLink} or call {businessPhone}.',
        description: 'Sent for overdue invoices'
      }
    ];
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): { isValid: boolean; formatted?: string; error?: string } {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid US number (10 digits) or international (11+ digits)
    if (cleaned.length === 10) {
      return {
        isValid: true,
        formatted: `+1${cleaned}`
      };
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return {
        isValid: true,
        formatted: `+${cleaned}`
      };
    } else if (cleaned.length > 11) {
      return {
        isValid: true,
        formatted: `+${cleaned}`
      };
    } else {
      return {
        isValid: false,
        error: 'Phone number must be at least 10 digits'
      };
    }
  }
}

export const twilioService = new TwilioService();
