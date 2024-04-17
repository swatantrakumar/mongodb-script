FROM amazonlinux:2

# Set environment variables
ENV LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    PYTHONUNBUFFERED=1

# Install system dependencies and Python
RUN yum update -y && \
    yum install -y amazon-linux-extras && \
    amazon-linux-extras install -y python3.8 && \
    yum install -y python3-pip

# Install pymongo
RUN pip3 install pymongo

# Set the working directory
WORKDIR /app

# Copy your application code into the container
COPY . /app

# Start your application
CMD ["python3", "trigger_script.py"]
#Make sure to replace your_script.py with the actual name of your Python script. To build and run the Docker image, follow these steps:








