with open('docker-compose.yml', 'r') as f:
    c = f.read()
import re
c = re.sub(r'(    environment:\n)', r'    env_file: ./backend/.env\n\1', c)
with open('docker-compose.yml', 'w') as f:
    f.write(c)
