In order to run this project inside a new environment:

You need to create two kubernetes context secrets:

1. kubectl create secret generic mst-jwt-secret --from-literal=JWT_KEY=<ANY_KEY_AS_A_JWT_SECRET>                                            
2. kubectl create secret generic mst-stripe-secret --from-literal STRIPE_KEY=<STRIPE_Secret_key>

Also, for the ingress-nginx deployment we need to follow the following in any environment or the cloud provider:
- https://kubernetes.github.io/ingress-nginx/deploy/

Current production project is deployed to DigitalOcean hence you need to looking into:
Before that you need follow the below tutorial you need to make sure that you are connected to 
correct kubernets context. To do that;

i). List all available contexts
`kubectl config view`

ii). Select the cluster "name" you want to use from the above list:
Command :
`kubectl config use-context <context_name>`

iii). Then follow the relevant section
https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean
