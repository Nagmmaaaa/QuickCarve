// src/pages/FAQPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FAQPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqCategories = [
    {
      category: "Ordering",
      icon: "🛒",
      faqs: [
        {
          id: "order",
          question: "How do I place an order?",
          answer: "Browse restaurants, add items to your cart, and proceed to checkout. Select a delivery address and payment option, then place your order."
        },
        {
          id: "cart",
          question: "Can I update items in my cart?",
          answer: "Yes, you can increase, decrease, or remove items from the cart before placing the order."
        }
      ]
    },
    {
      category: "Delivery",
      icon: "🚚",
      faqs: [
        {
          id: "delivery-fee",
          question: "How are delivery charges calculated?",
          answer: "Delivery charges depend on the order value. Orders above ₹500 qualify for free delivery."
        },
        {
          id: "delivery-time",
          question: "How long does delivery take?",
          answer: "Delivery typically takes 25-35 minutes depending on your location and restaurant preparation time."
        }
      ]
    },
    {
      category: "Payment",
      icon: "💳",
      faqs: [
        {
          id: "payment",
          question: "What payment options are available?",
          answer: "Currently, we accept Cash on Delivery (COD). Online payment options will be available soon."
        },
        {
          id: "secure",
          question: "Is my order secure?",
          answer: "Yes, all orders are processed securely and tracked in real-time."
        }
      ]
    },
    {
      category: "Support",
      icon: "💬",
      faqs: [
        {
          id: "support",
          question: "How can I contact support?",
          answer: "You can reach us via email at hello@quickcrave.com or call +91 929036."
        },
        {
          id: "track",
          question: "Can I track my order?",
          answer: "Yes, you can track your order status from your profile page after placing an order."
        }
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 5 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2, color: '#666', textTransform: 'none' }}
          >
            Back to Home
          </Button>
          
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find answers to common questions about QuickCrave
          </Typography>
        </Box>

        {/* FAQ Categories */}
        {faqCategories.map((category, catIdx) => (
          <Box key={catIdx} sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span>{category.icon}</span>
              {category.category}
            </Typography>

            {category.faqs.map((faq, idx) => (
              <Accordion
                key={faq.id}
                expanded={expanded === `${catIdx}-${idx}`}
                onChange={handleChange(`${catIdx}-${idx}`)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  '&.Mui-expanded': {
                    margin: '0 0 8px 0',
                  },
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    '&:hover': { bgcolor: '#f9fafb' }
                  }}
                >
                  <Typography fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
        
      </Container>
    </Box>
  );
};

export default FAQPage;