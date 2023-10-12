# Use Nginx image
FROM nginx:alpine

# Copy static files to Nginx container
COPY src/assets /usr/share/nginx/html

# Expose port 80
EXPOSE 80
