FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend_dist /usr/share/nginx/html
COPY frontend_nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
