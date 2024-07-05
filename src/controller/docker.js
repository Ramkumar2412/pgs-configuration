import Docker from 'dockerode';

const docker = new Docker();

export async function isImageRunning(imageName) {
    try {
      // List all containers (both running and stopped)
      const containers = await docker.listContainers({ all: true });

     // console.log("Containers",containers)
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
      console.error('Error in stopping docker:', error);
    }
  }

  export async function stopDockerContainer(req , res){
    try{
      const imageName = process.env.DOCKER_CONTAINER;
      const imageRunning = await isImageRunning(imageName);
      console.log("imageRunning in stopDocker" , imageRunning);
      if(imageRunning == true)
      {
        try{
          stopDocker(imageName);
          res.status(200).send({
            ErrCode: 200,
            ErrDesc: "Docker container stopped successfully"
          });
        }
        catch (err) {
          console.log("Error stopping Docker container", err);
          res.status(500).send({
            ErrCode: 500,
            ErrDesc: err.message
          });
        }
     
      }
      else
      {
        console.error("Docker container is already stopped ");
        res.status(401).send({
          ErrCode:401,
          ErrDesc:"Docker container is already stopped "
        });
      }
    }
    catch(error){
      console.log("For catch stoping",error);
          res.status(401).send({
            ErrCode:401,
            ErrDesc:error
          });
    }

   
  }

  export async function restartDockerContainer(req , res) {
    try{
      const imageName = process.env.DOCKER_CONTAINER;
      await restartDocker(imageName);
      res.status(200).send({
        ErrCode: 200,
        ErrDesc: "Docker container started successfully"
      });
    }
    catch (err) {
      console.log("Error stopping Docker container", err);
      res.status(500).send({
        ErrCode: 500,
        ErrDesc: err.message
      });
    }
  }