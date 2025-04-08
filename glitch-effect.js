document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los elementos que tengan la clase "glitch"
    const glitchElements = document.querySelectorAll(".glitch");
  
    glitchElements.forEach(el => {
      // Cada cierto tiempo se aplica una distorsión aleatoria
      setInterval(() => {
        // Genera un desplazamiento aleatorio en X e Y
        const xOffset = Math.floor(Math.random() * 6 - 3); // valor entre -3 y 3 px
        const yOffset = Math.floor(Math.random() * 6 - 3);
        
        // Aplica una transformación temporal
        el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        
        // Opcional: puedes también cambiar el color o el text-shadow de forma aleatoria
        const randomColor = Math.random() > 0.5 ? "#ff00ff" : "#00ffff";
        el.style.textShadow = `0 0 5px ${randomColor}, 0 0 10px ${randomColor}`;
  
        // Después de 100ms, vuelve al estado normal para crear un efecto intermitente
        setTimeout(() => {
          el.style.transform = "none";
          el.style.textShadow = "";
        }, 100);
      }, 3000 + Math.random() * 2000); // intervalo aleatorio entre 3000 y 5000ms
    });
  });
  