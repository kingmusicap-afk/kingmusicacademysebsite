// Email Templates for Automated Notifications

export const emailTemplates = {
  // Scholarship Application Approved
  scholarshipApproved: (firstName: string, courseInterested: string) => ({
    subject: 'Great News! Your Scholarship Application Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003D7A 0%, #0052CC 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Congratulations, ${firstName}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your Scholarship Application Has Been Approved</p>
        </div>
        <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We are delighted to inform you that your scholarship application for the <strong>${courseInterested}</strong> course has been approved!
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            This is a wonderful opportunity to pursue your passion for music with the support of generous sponsors who believe in your potential.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #003D7A; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #003D7A;">Next Steps:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>Contact our enrollment team to finalize your registration</li>
              <li>Receive your course materials and schedule</li>
              <li>Begin your musical journey with us</li>
            </ul>
          </div>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            If you have any questions, please don't hesitate to reach out to us.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br/>
            <strong>King Music Academy Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Scholarship Application Rejected
  scholarshipRejected: (firstName: string, courseInterested: string) => ({
    subject: 'Scholarship Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003D7A 0%, #0052CC 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Scholarship Application Update</h1>
        </div>
        <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Dear ${firstName},
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Thank you for applying for our scholarship program for the <strong>${courseInterested}</strong> course. We appreciate your interest in King Music Academy.
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Unfortunately, your application was not selected at this time. This does not reflect your potential or worthiness, but rather the limited number of scholarships available.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #FF6B6B; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #FF6B6B;">Don't Give Up:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>You can reapply in the next scholarship cycle</li>
              <li>Explore flexible payment plans for our courses</li>
              <li>Contact us to discuss other opportunities</li>
            </ul>
          </div>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We encourage you to stay in touch and consider applying again. Your passion for music matters to us.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br/>
            <strong>King Music Academy Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Church Booking Confirmed
  churchBookingConfirmed: (churchName: string, date: string, participants: number, totalCost: number) => ({
    subject: `Church Package Booking Confirmed - ${churchName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003D7A 0%, #0052CC 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Church Worship Seminar & Training</p>
        </div>
        <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Thank you for booking our Church Worship Seminar & Training program!
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #003D7A;">
            <h3 style="margin-top: 0; color: #003D7A;">Booking Details:</h3>
            <table style="width: 100%; color: #333; line-height: 2;">
              <tr>
                <td style="font-weight: bold;">Church:</td>
                <td>${churchName}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Date:</td>
                <td>${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Participants:</td>
                <td>${participants}</td>
              </tr>
              <tr style="border-top: 2px solid #eee;">
                <td style="font-weight: bold; font-size: 18px;">Total Cost:</td>
                <td style="font-weight: bold; font-size: 18px; color: #003D7A;">Rs ${totalCost.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #003D7A; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #003D7A;">Program Modules:</h3>
            <ol style="color: #333; line-height: 1.8;">
              <li><strong>How to Lead Worship in Church</strong> - Develop leadership skills and spiritual connection</li>
              <li><strong>Sound System in Church</strong> - Learn essential equipment and setup</li>
              <li><strong>Organise Rehearsal & Songs</strong> - Prepare and execute professional performances</li>
            </ol>
          </div>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Our team will be in touch with payment details and further instructions. We look forward to training your church musicians!
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br/>
            <strong>King Music Academy Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Sponsor Impact Report (Quarterly)
  sponsorImpactReport: (sponsorName: string, quarter: string, year: number, studentsHelped: number, totalAmount: number) => ({
    subject: `Your Scholarship Impact Report - Q${quarter} ${year}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003D7A 0%, #0052CC 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Your Scholarship Impact</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Q${quarter} ${year} Impact Report</p>
        </div>
        <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Dear ${sponsorName},
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Thank you for your generous support of our scholarship program! We're delighted to share the impact of your contribution this quarter.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #eee;">
              <div style="font-size: 32px; font-weight: bold; color: #003D7A;">${studentsHelped}</div>
              <div style="color: #666; margin-top: 5px;">Students Helped This Quarter</div>
            </div>
            <div style="text-align: center; padding: 20px 0;">
              <div style="font-size: 28px; font-weight: bold; color: #28a745;">Rs ${totalAmount.toLocaleString()}</div>
              <div style="color: #666; margin-top: 5px;">Total Scholarship Distributed</div>
            </div>
          </div>
          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #003D7A;">Student Success Stories:</h3>
            <p style="color: #333; line-height: 1.8;">
              Your support has enabled deserving students to pursue their musical dreams. These students are now progressing through their courses and developing skills that will shape their futures. Many have already participated in academy performances and are gaining confidence as musicians.
            </p>
          </div>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Your generosity makes a real difference. Together, we're building a community of talented musicians and transforming lives through music education.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            With gratitude,<br/>
            <strong>King Music Academy Team</strong>
          </p>
        </div>
      </div>
    `
  })
};

export type EmailTemplate = keyof typeof emailTemplates;
