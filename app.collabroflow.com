server {

        server_name app.collabroflow.com;

	location / {
	    # Simple requests
	    if ($request_method ~* "(GET|POST)") {
	      add_header "Access-Control-Allow-Origin"  *;
	    }

	    # Preflighted requests
	    if ($request_method = OPTIONS ) {
	      add_header "Access-Control-Allow-Origin"  *;
	      add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
	      add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
	      return 200;
	    }
            root /home/ubuntu/social-media-help/social-media-help/Frontend/www/dist;
	    try_files $uri $uri/ /index.html;
	}

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/app.collabroflow.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/app.collabroflow.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = app.collabroflow.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


	listen 80;
	listen [::]:80;

        server_name app.collabroflow.com;
    return 404; # managed by Certbot


}