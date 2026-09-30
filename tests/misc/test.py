from datetime import datetime
from pydantic import BaseModel

class M(BaseModel):
    d: datetime

print(M(d=datetime(2026,9,23)).model_dump_json())
