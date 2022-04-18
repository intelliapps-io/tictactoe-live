#https://stackoverflow.com/questions/66982720/keep-running-into-the-same-deployment-error-exec-format-error-when-pushing-nod
docker buildx build --no-cache --platform linux/amd64 -t tiktactoe .  
docker tag tiktactoe registry.heroku.com/tiktactoe-live/web
docker push registry.heroku.com/tiktactoe-live/web  
heroku container:release web -a tiktactoe-live