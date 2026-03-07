// src/pages/ContactUsPage.js
import React from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  message: yup.string().required('Message is required'),
});

const ContactUsPage = () => {
  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      alert("Your message has been submitted successfully.");
      resetForm();
    },
  });

  return (
    <Box sx={{ minHeight: '88vh', bgcolor: '#f5f5f5', py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h6" color="text.secondary">
            We'd love to hear from you. Fill out the form below or contact us directly.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 3 }}>
                <EmailIcon sx={{ color: '#22c55e', mr: 2 }} />
                <Typography>hello@quickcrave.com</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon sx={{ color: '#22c55e', mr: 2 }} />
                <Typography>+91 9290360001</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ color: '#22c55e', mr: 2 }} />
                <Typography>Mumbai, Maharashtra, India</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} alignItems="stretch">

                  {/* Name */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Your Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#000", 
                          },
                        },
                        "& label.Mui-focused": {
                          color: "#000", 
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#000", 
                          },
                        },
                        "& label.Mui-focused": {
                          color: "#000", 
                        },
                      }}
                    />
                  </Grid>

                  {/* Message */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="message"
                      name="message"
                      label="Your Message"
                      multiline
                      rows={3}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#000", 
                          },
                        },
                        "& label.Mui-focused": {
                          color: "#000", 
                        },
                      }}
                    />
                  </Grid>

                  {/* Button */}
                  <Grid item xs={12} md={2} display="flex">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: '#22c55e',
                        fontWeight: 600,
                        alignSelf: 'stretch',
                        "&:hover": {
                          bgcolor: "#16a34a",
                        },
                      }}
                    >
                      SEND
                    </Button>
                  </Grid>

                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUsPage;