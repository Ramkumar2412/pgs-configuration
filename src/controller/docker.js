import Docker from 'dockerode';

const docker = new Docker();

export async function isImageRunning(imageName) {
    try {
      // List all containers (both running and stopped)
      const containers = await docker.listContainers({ all: true });

      console.log("Containers",containers)
  
      const imageRunning = containers.find(container => container['Image'] === imageName);

      console.log("ImageRunning" , imageRunning)
   
  
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
  