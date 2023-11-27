FROM python:3.9

WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

ENV RABBITMQ_HOSTNAME=
ENV RABBITMQ_USER=
ENV RABBITMQ_PASSWORD=
ENV RABBITMQ_PORT=
ENV RABBITMQ_PROTOCOL=

COPY . /code   

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000