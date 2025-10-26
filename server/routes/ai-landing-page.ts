import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key"
});

interface LandingPageRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  userPrompt: string;
}

// Generate landing page with AI
router.post('/generate-landing-page', async (req, res) => {
  try {
    const { messages, userPrompt }: LandingPageRequest = req.body;

    if (!userPrompt || !process.env.OPENAI_API_KEY) {
      return res.status(400).json({ 
        error: 'Missing required parameters or API key not configured' 
      });
    }

    // Create a comprehensive prompt for landing page generation
    const systemPrompt = `You are an expert landing page designer and copywriter specializing in field service businesses (HVAC, plumbing, electrical, landscaping). 

Your task is to:
1. Analyze the user's request for a landing page
2. Generate a complete, professional HTML landing page with embedded CSS
3. Focus on conversion optimization and mobile responsiveness
4. Include relevant field service industry elements
5. Use modern, clean design principles

Response format: Return a JSON object with:
{
  "message": "Brief description of what you created",
  "landingPage": {
    "title": "Page title",
    "description": "Brief page description", 
    "html": "Complete HTML content (body content only, no DOCTYPE/html/head tags)",
    "css": "Complete CSS styles for the page",
    "thumbnail": "Brief description for thumbnail preview"
  }
}

Design guidelines:
- Use professional color schemes (blues, greens, or business colors)
- Include clear call-to-action buttons
- Mobile-first responsive design
- Professional typography
- Trust signals (reviews, certifications, guarantees)
- Contact forms or phone numbers prominently displayed
- Hero section with compelling headline
- Service benefits and features
- Customer testimonials when relevant

Make the page conversion-focused and industry-appropriate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-5), // Keep last 5 messages for context
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response generated');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      parsedResponse = {
        message: "I've created a professional landing page for your field service business.",
        landingPage: {
          title: "Professional Field Service Landing Page",
          description: "High-converting landing page with modern design",
          html: generateFallbackHTML(userPrompt),
          css: generateFallbackCSS(),
          thumbnail: "Professional service page with hero section and contact form"
        }
      };
    }

    // Ensure we have the required structure
    if (!parsedResponse.landingPage) {
      parsedResponse.landingPage = {
        title: "Generated Landing Page",
        description: "AI-generated landing page",
        html: generateFallbackHTML(userPrompt),
        css: generateFallbackCSS(),
        thumbnail: "Custom landing page"
      };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Landing page generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate landing page',
      message: 'I encountered an error while generating your landing page. Please try again with a more specific description of what you need.'
    });
  }
});

// Fallback HTML generator for when OpenAI response fails
function generateFallbackHTML(userPrompt: string): string {
  const serviceType = detectServiceType(userPrompt);
  
  return `
    <div class="landing-page">
      <header class="hero-section">
        <div class="container">
          <h1 class="hero-title">Professional ${serviceType} Services</h1>
          <p class="hero-subtitle">Reliable, fast, and affordable ${serviceType.toLowerCase()} solutions for your home or business</p>
          <div class="hero-cta">
            <a href="#contact" class="btn-primary">Get Free Quote</a>
            <a href="tel:555-123-4567" class="btn-secondary">Call Now: (555) 123-4567</a>
          </div>
        </div>
      </header>

      <section class="services-section">
        <div class="container">
          <h2>Our Services</h2>
          <div class="services-grid">
            <div class="service-card">
              <h3>Emergency Service</h3>
              <p>24/7 emergency ${serviceType.toLowerCase()} service when you need it most</p>
            </div>
            <div class="service-card">
              <h3>Maintenance</h3>
              <p>Regular maintenance to keep your systems running efficiently</p>
            </div>
            <div class="service-card">
              <h3>Installation</h3>
              <p>Professional installation of new ${serviceType.toLowerCase()} systems</p>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials-section">
        <div class="container">
          <h2>What Our Customers Say</h2>
          <div class="testimonials-grid">
            <div class="testimonial">
              <p>"Excellent service! Fast, professional, and reasonably priced."</p>
              <div class="testimonial-author">- Sarah M.</div>
            </div>
            <div class="testimonial">
              <p>"They fixed our problem quickly and explained everything clearly."</p>
              <div class="testimonial-author">- Mike R.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact">
        <div class="container">
          <h2>Get Your Free Quote Today</h2>
          <form class="contact-form">
            <div class="form-group">
              <input type="text" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email Address" required>
            </div>
            <div class="form-group">
              <input type="tel" placeholder="Phone Number" required>
            </div>
            <div class="form-group">
              <textarea placeholder="Describe your ${serviceType.toLowerCase()} needs" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Request Free Quote</button>
          </form>
        </div>
      </section>
    </div>
  `;
}

function generateFallbackCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 15px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .btn-primary {
      background: #ff6b6b;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #ff5252;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    .services-section, .testimonials-section, .contact-section {
      padding: 80px 0;
    }

    .services-section {
      background: #f8f9fa;
    }

    .services-section h2, .testimonials-section h2, .contact-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #2d3748;
    }

    .services-grid, .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .service-card:hover {
      transform: translateY(-5px);
    }

    .service-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .testimonial {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }

    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .testimonial-author {
      font-weight: bold;
      color: #667eea;
    }

    .contact-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .contact-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group input, .form-group textarea {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      background: rgba(255,255,255,0.9);
    }

    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-cta {
        flex-direction: column;
        align-items: center;
      }
      
      .services-grid, .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}

function detectServiceType(prompt: string): string {
  const prompt_lower = prompt.toLowerCase();
  
  if (prompt_lower.includes('hvac') || prompt_lower.includes('heating') || prompt_lower.includes('cooling') || prompt_lower.includes('air condition')) {
    return 'HVAC';
  } else if (prompt_lower.includes('plumb') || prompt_lower.includes('pipe') || prompt_lower.includes('drain')) {
    return 'Plumbing';
  } else if (prompt_lower.includes('electric') || prompt_lower.includes('wiring') || prompt_lower.includes('electrical')) {
    return 'Electrical';
  } else if (prompt_lower.includes('landscap') || prompt_lower.includes('lawn') || prompt_lower.includes('garden')) {
    return 'Landscaping';
  } else {
    return 'Field Service';
  }
}

export default router;