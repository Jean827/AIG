import urllib.request
import sys

try:
    url = 'https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-starter-parent/3.2.1/spring-boot-starter-parent-3.2.1.pom'
    print(f'Trying to download: {url}')
    response = urllib.request.urlopen(url, timeout=10)
    content = response.read()
    print(f'Success! Downloaded {len(content)} bytes')
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)