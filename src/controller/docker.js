import Docker from 'dockerode';

const docker = new Docker();

export async function isImageRunning(imageName) {
    try {
      // List all containers (both running and stopped)
      const containers = await docker.listContainers({ all: true });

      console.log("Containers",containers)
      console.log("ImageName" , imageName);
      const imageRunning = containers.find(container => container['Image'] === imageName);

      console.log("ImageRunning" , imageRunning);

      console.log("ImageRunning" , imageRunning.State);

      
  
      if (imageRunning.State === 'running') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
  
  export async function restartDocker(imageName){
    try{
      const containers = await docker.listContainers({ all: true });
      const imageRunning = containers.find(container => container['Image'] === imageName);
      const container_id = imageRunning.Id;

      console.log("container",container_id);
      const container = docker.getContainer(container_id);

      // Restart the container
      await container.restart();
      return container_id;
    }
    catch(error){
      console.error('Error:', error);
    }
  }

  export async function stopDocker(imageName){
    try{
      const containers = await docker.listContainers({ all: true });
      const imageRunning = containers.find(container => container['Image'] === imageName);
      const container_id = imageRunning.Id;

      console.log("container",container_id);
      const container = docker.getContainer(container_id);

      // Restart the container
      await container.stop();
      return container_id;
    }
    catch(error){
      console.error('Error:', error);
    }
  }