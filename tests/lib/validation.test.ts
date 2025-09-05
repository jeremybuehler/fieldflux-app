import { describe, it, expect, vi } from 'vitest';
import {
  commonSchemas,
  leadSchemas,
  socialSchemas,
  analyticsSchemas,
  wordPressSchemas,
  reviewSchemas,
  felixSchemas,
  validateRequest,
  validators,
  validateEmail,
  validateUrl,
  validateUUID,
  sanitizeString,
  sanitizeHtml,
  validateFileUpload
} from '@/server/lib/validation';
import { ValidationError } from '@/server/lib/errors';
import type { Request, Response, NextFunction } from 'express';

describe('Common Schemas', () => {
  describe('ID validation', () => {
    it('should validate valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const result = commonSchemas.id.safeParse(validUUID);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const invalidUUID = 'not-a-uuid';
      const result = commonSchemas.id.safeParse(invalidUUID);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('Invalid ID format');
    });
  });

  describe('Pagination schema', () => {
    it('should apply default values', () => {
      const result = commonSchemas.pagination.parse({});
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should coerce string numbers', () => {
      const result = commonSchemas.pagination.parse({ page: '2', limit: '50' });
      expect(result).toEqual({ page: 2, limit: 50 });
    });

    it('should enforce minimum values', () => {
      const result = commonSchemas.pagination.safeParse({ page: 0, limit: 0 });
      expect(result.success).toBe(false);
    });

    it('should enforce maximum limit', () => {
      const result = commonSchemas.pagination.safeParse({ limit: 200 });
      expect(result.success).toBe(false);
    });
  });

  describe('Email validation', () => {
    const validEmails = [
      'test@example.com',
      'user+tag@domain.co.uk',
      'name.surname@sub.domain.org',
      'user123@test-domain.com'
    ];

    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user..name@domain.com',
      'user@domain',
      'user name@domain.com'
    ];

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, () => {
        const result = commonSchemas.email.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    invalidEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, () => {
        const result = commonSchemas.email.safeParse(email);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Phone validation', () => {
    const validPhones = [
      '+1-555-123-4567',
      '(555) 123-4567',
      '555.123.4567',
      '5551234567',
      '+44 20 7946 0958'
    ];

    const invalidPhones = [
      'abc-def-ghij',
      '123',
      'phone-number',
      '+1-555-CALL-NOW'
    ];

    validPhones.forEach(phone => {
      it(`should accept valid phone: ${phone}`, () => {
        const result = commonSchemas.phone.safeParse(phone);
        expect(result.success).toBe(true);
      });
    });

    invalidPhones.forEach(phone => {
      it(`should reject invalid phone: ${phone}`, () => {
        const result = commonSchemas.phone.safeParse(phone);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('URL validation', () => {
    const validUrls = [
      'https://example.com',
      'http://sub.domain.org/path',
      'https://api.service.com/v1/endpoint?param=value',
      'ftp://files.example.com/folder/file.txt'
    ];

    const invalidUrls = [
      'not-a-url',
      'example.com',
      'http://',
      'https://invalid..domain.com'
    ];

    validUrls.forEach(url => {
      it(`should accept valid URL: ${url}`, () => {
        const result = commonSchemas.url.safeParse(url);
        expect(result.success).toBe(true);
      });
    });

    invalidUrls.forEach(url => {
      it(`should reject invalid URL: ${url}`, () => {
        const result = commonSchemas.url.safeParse(url);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Social platform validation', () => {
    const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const invalidPlatforms = ['youtube', 'tiktok', 'snapchat', 'invalid'];

    validPlatforms.forEach(platform => {
      it(`should accept valid platform: ${platform}`, () => {
        const result = commonSchemas.socialPlatform.safeParse(platform);
        expect(result.success).toBe(true);
      });
    });

    invalidPlatforms.forEach(platform => {
      it(`should reject invalid platform: ${platform}`, () => {
        const result = commonSchemas.socialPlatform.safeParse(platform);
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('Lead Schemas', () => {
  describe('Create lead schema', () => {
    const validLead = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-123-4567',
      message: 'Need HVAC repair',
      source: 'google',
      urgency: 'high',
      serviceNeeded: 'heating repair',
      address: '123 Main St, City, State'
    };

    it('should validate complete lead data', () => {
      const result = leadSchemas.create.safeParse(validLead);
      expect(result.success).toBe(true);
    });

    it('should require name and email only', () => {
      const minimalLead = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      const result = leadSchemas.create.safeParse(minimalLead);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.urgency).toBe('medium'); // default value
      }
    });

    it('should reject empty name', () => {
      const invalidLead = { ...validLead, name: '' };
      const result = leadSchemas.create.safeParse(invalidLead);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidLead = { ...validLead, email: 'invalid-email' };
      const result = leadSchemas.create.safeParse(invalidLead);
      expect(result.success).toBe(false);
    });

    it('should limit message length', () => {
      const longMessage = 'a'.repeat(2001);
      const invalidLead = { ...validLead, message: longMessage };
      const result = leadSchemas.create.safeParse(invalidLead);
      expect(result.success).toBe(false);
    });
  });

  describe('Update lead schema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = { name: 'Updated Name' };
      const result = leadSchemas.update.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate status enum', () => {
      const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
      
      validStatuses.forEach(status => {
        const result = leadSchemas.update.safeParse({ status });
        expect(result.success).toBe(true);
      });

      const invalidResult = leadSchemas.update.safeParse({ status: 'invalid' });
      expect(invalidResult.success).toBe(false);
    });

    it('should limit notes length', () => {
      const longNotes = 'a'.repeat(5001);
      const result = leadSchemas.update.safeParse({ notes: longNotes });
      expect(result.success).toBe(false);
    });
  });
});

describe('Social Media Schemas', () => {
  describe('Social post schema', () => {
    const validPost = {
      content: 'Great HVAC tips for winter maintenance!',
      platforms: ['facebook', 'instagram'],
      mediaUrls: ['https://example.com/image.jpg'],
      scheduledFor: new Date(Date.now() + 86400000), // tomorrow
      tags: ['hvac', 'maintenance', 'winter']
    };

    it('should validate complete post data', () => {
      const result = socialSchemas.post.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it('should require at least one platform', () => {
      const invalidPost = { ...validPost, platforms: [] };
      const result = socialSchemas.post.safeParse(invalidPost);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('Select at least one platform');
    });

    it('should limit content length', () => {
      const longContent = 'a'.repeat(2201);
      const invalidPost = { ...validPost, content: longContent };
      const result = socialSchemas.post.safeParse(invalidPost);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('Content too long');
    });

    it('should validate platform enum values', () => {
      const invalidPost = { ...validPost, platforms: ['youtube'] };
      const result = socialSchemas.post.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should validate media URLs', () => {
      const invalidPost = { ...validPost, mediaUrls: ['not-a-url'] };
      const result = socialSchemas.post.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });

  describe('Schedule post schema', () => {
    const futureDate = new Date(Date.now() + 86400000);
    const pastDate = new Date(Date.now() - 86400000);

    it('should accept future dates', () => {
      const validSchedule = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        scheduledFor: futureDate
      };

      const result = socialSchemas.schedule.safeParse(validSchedule);
      expect(result.success).toBe(true);
    });

    it('should reject past dates', () => {
      const invalidSchedule = {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        scheduledFor: pastDate
      };

      const result = socialSchemas.schedule.safeParse(invalidSchedule);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toBe('Scheduled time must be in the future');
    });
  });
});

describe('Felix AI Schemas', () => {
  describe('Chat schema', () => {
    const validChat = {
      message: 'How can I improve my marketing?',
      context: {
        currentPage: '/dashboard',
        businessData: { leads: 5, posts: 10 }
      }
    };

    it('should validate complete chat data', () => {
      const result = felixSchemas.chat.safeParse(validChat);
      expect(result.success).toBe(true);
    });

    it('should work without context', () => {
      const minimalChat = { message: 'Hello Felix' };
      const result = felixSchemas.chat.safeParse(minimalChat);
      expect(result.success).toBe(true);
    });

    it('should limit message length', () => {
      const longMessage = 'a'.repeat(1001);
      const invalidChat = { ...validChat, message: longMessage };
      const result = felixSchemas.chat.safeParse(invalidChat);
      expect(result.success).toBe(false);
    });

    it('should reject empty message', () => {
      const invalidChat = { ...validChat, message: '' };
      const result = felixSchemas.chat.safeParse(invalidChat);
      expect(result.success).toBe(false);
    });
  });

  describe('Content generation schema', () => {
    const validGeneration = {
      type: 'social',
      topic: 'HVAC maintenance',
      tone: 'professional',
      length: 'medium',
      keywords: ['hvac', 'maintenance', 'tips']
    };

    it('should validate complete generation data', () => {
      const result = felixSchemas.contentGeneration.safeParse(validGeneration);
      expect(result.success).toBe(true);
    });

    it('should apply default values', () => {
      const minimal = { type: 'blog' };
      const result = felixSchemas.contentGeneration.parse(minimal);
      
      expect(result.tone).toBe('professional');
      expect(result.length).toBe('medium');
    });

    it('should validate type enum', () => {
      const invalidType = { ...validGeneration, type: 'invalid' };
      const result = felixSchemas.contentGeneration.safeParse(invalidType);
      expect(result.success).toBe(false);
    });

    it('should validate tone enum', () => {
      const validTones = ['professional', 'casual', 'friendly', 'urgent'];
      
      validTones.forEach(tone => {
        const data = { ...validGeneration, tone };
        const result = felixSchemas.contentGeneration.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });
});

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    mockResponse = {};
    mockNext = vi.fn();
  });

  describe('validateRequest factory', () => {
    it('should validate request body', () => {
      const validator = validateRequest({
        body: leadSchemas.create
      });

      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      validator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body.urgency).toBe('medium'); // default applied
    });

    it('should validate request params', () => {
      const validator = validateRequest({
        params: commonSchemas.id
      });

      mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

      validator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate query parameters', () => {
      const validator = validateRequest({
        query: commonSchemas.pagination
      });

      mockRequest.query = { page: '2', limit: '50' };

      validator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.query).toEqual({ page: 2, limit: 50 });
    });

    it('should pass validation errors to next middleware', () => {
      const validator = validateRequest({
        body: leadSchemas.create
      });

      mockRequest.body = { name: '', email: 'invalid-email' };

      validator(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Predefined validators', () => {
    it('should validate create lead request', () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-123-4567'
      };

      validators.createLead(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should validate pagination query', () => {
      mockRequest.query = { page: '1', limit: '25' };

      validators.pagination(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.query).toEqual({ page: 1, limit: 25 });
    });

    it('should validate ID parameter', () => {
      mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

      validators.idParam(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});

describe('Validation Helpers', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://sub.domain.org/path')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
    });
  });

  describe('validateUUID', () => {
    it('should return true for valid UUIDs', () => {
      expect(validateUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(validateUUID('not-a-uuid')).toBe(false);
      expect(validateUUID('123-456-789')).toBe(false);
    });
  });
});

describe('Sanitization Helpers', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('should remove HTML characters', () => {
      expect(sanitizeString('hello <script>alert("xss")</script>')).toBe('hello scriptalert("xss")/script');
    });

    it('should normalize whitespace', () => {
      expect(sanitizeString('hello    world\n\ttab')).toBe('hello world tab');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString, 100)).toHaveLength(100);
    });

    it('should handle non-string input', () => {
      expect(sanitizeString(123 as any)).toBe('');
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const malicious = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(malicious);
      expect(result).toBe('<p>Hello</p>');
    });

    it('should remove iframe tags', () => {
      const malicious = '<div>Content</div><iframe src="evil.com"></iframe>';
      const result = sanitizeHtml(malicious);
      expect(result).toBe('<div>Content</div>');
    });

    it('should remove javascript URLs', () => {
      const malicious = '<a href="javascript:alert(\'xss\')">Click</a>';
      const result = sanitizeHtml(malicious);
      expect(result).toBe('<a href="alert(\'xss\')">Click</a>');
    });

    it('should remove event handlers', () => {
      const malicious = '<button onclick="alert(\'xss\')">Click</button>';
      const result = sanitizeHtml(malicious);
      expect(result).toBe('<button>Click</button>');
    });

    it('should handle non-string input', () => {
      expect(sanitizeHtml(123 as any)).toBe('');
      expect(sanitizeHtml(null as any)).toBe('');
    });
  });
});

describe('File Upload Validation', () => {
  const validFile = {
    filename: 'image.jpg',
    mimetype: 'image/jpeg',
    size: 1024 * 1024 // 1MB
  };

  it('should validate allowed file types', () => {
    const allowedTypes = [
      { ...validFile, mimetype: 'image/jpeg' },
      { ...validFile, mimetype: 'image/png' },
      { ...validFile, mimetype: 'video/mp4' },
      { ...validFile, mimetype: 'application/pdf' }
    ];

    allowedTypes.forEach(file => {
      const result = validateFileUpload(file);
      expect(result.valid).toBe(true);
      expect(result.sanitizedName).toBeDefined();
    });
  });

  it('should reject disallowed file types', () => {
    const disallowedFile = { ...validFile, mimetype: 'application/exe' };
    const result = validateFileUpload(disallowedFile);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('File type not allowed');
  });

  it('should reject files that are too large', () => {
    const largeFile = { ...validFile, size: 20 * 1024 * 1024 }; // 20MB
    const result = validateFileUpload(largeFile);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('File size must be less than 10MB');
  });

  it('should sanitize filenames', () => {
    const unsafeFile = { ...validFile, filename: '../../../etc/passwd!@#$.jpg' };
    const result = validateFileUpload(unsafeFile);
    
    expect(result.valid).toBe(true);
    expect(result.sanitizedName).toBe('______etc_passwd____.jpg');
  });

  it('should limit filename length', () => {
    const longNameFile = { 
      ...validFile, 
      filename: 'a'.repeat(200) + '.jpg'
    };
    const result = validateFileUpload(longNameFile);
    
    expect(result.valid).toBe(true);
    expect(result.sanitizedName?.length).toBeLessThanOrEqual(100);
  });

  it('should handle validation errors', () => {
    const invalidFile = { filename: '', mimetype: '', size: 'invalid' };
    const result = validateFileUpload(invalidFile);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle undefined input gracefully', () => {
    expect(() => commonSchemas.email.safeParse(undefined)).not.toThrow();
    expect(() => leadSchemas.create.safeParse(undefined)).not.toThrow();
  });

  it('should handle null input gracefully', () => {
    expect(() => commonSchemas.email.safeParse(null)).not.toThrow();
    expect(() => socialSchemas.post.safeParse(null)).not.toThrow();
  });

  it('should handle numeric input where string expected', () => {
    const result = commonSchemas.nonEmptyString.safeParse(123);
    expect(result.success).toBe(false);
  });

  it('should handle array input where object expected', () => {
    const result = leadSchemas.create.safeParse([]);
    expect(result.success).toBe(false);
  });

  it('should preserve custom error messages', () => {
    const result = commonSchemas.nonEmptyString.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Field cannot be empty');
    }
  });

  it('should handle deeply nested validation', () => {
    const complexData = {
      message: 'test',
      context: {
        currentPage: '/test',
        businessData: {
          nested: {
            deeply: {
              value: 'test'
            }
          }
        }
      }
    };

    const result = felixSchemas.chat.safeParse(complexData);
    expect(result.success).toBe(true);
  });
});