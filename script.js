const emotions = {
    Happy: {
      Content: ["Peaceful", "Satisfied"],
      Excited: ["Joyful", "Energetic"]
    },
    Sad: {
      Disappointed: ["Let down", "Discouraged"],
      Lonely: ["Isolated", "Abandoned"]
    },
    Angry: {
      Frustrated: ["Irritated", "Annoyed"],
      Hostile: ["Hateful", "Vengeful"]
    },
    Afraid: {
      Insecure: ["Helpless", "Nervous"],
      Anxious: ["Worried", "Fearful"]
    },
    Surprised: {
      Amazed: ["Astonished", "Shocked"],
      Confused: ["Disoriented", "Disbelieving"]
    },
    Disgusted: {
      Disapproving: ["Judgmental", "Embarrassed"],
      Repulsed: ["Horrified", "Nauseated"]
    }
  };
  
  const wheel = document.getElementById("feeling-wheel");
  const center = document.getElementById("center");
  
  let level = 0;
  let path = [];
  
  function createSegments(data) {
    wheel.innerHTML = '';
    const keys = Object.keys(data);
    const total = keys.length;
    const radius = 180;
  
    keys.forEach((key, i) => {
      const angle = (i / total) * 2 * Math.PI;
      const x = radius * Math.cos(angle) + 200;
      const y = radius * Math.sin(angle) + 200;
  
      const div = document.createElement("div");
      div.className = "segment";
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      div.textContent = key;
      div.onclick = () => {
        path.push(key);
        if (typeof data[key] === "object") {
          createSegments(data[key]);
          center.textContent = key;
          level++;
        } else {
          center.textContent = key;
        }
      };
  
      wheel.appendChild(div);
    });
  }
  
  center.onclick = () => {
    if (path.length > 0) {
      path.pop();
      let current = emotions;
      path.forEach(p => current = current[p]);
      createSegments(current);
      center.textContent = path[path.length - 1] || "Emotion";
      level--;
    }
  };
  
  createSegments(emotions);
  