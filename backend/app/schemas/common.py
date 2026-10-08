from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class APIErrorDetails(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class APIResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = "Operation completed successfully"


class APIErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorDetails
