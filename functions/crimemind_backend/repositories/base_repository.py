import os
import logging

try:
    import zcatalyst_sdk
    HAS_CATALYST = True
except ImportError:
    HAS_CATALYST = False

logger = logging.getLogger("crimemind.repository")

class BaseRepository:
    def __init__(self, request=None):
        self.has_catalyst = HAS_CATALYST
        self.request = request
        self.app = None
        
        if self.has_catalyst and request:
            try:
                # Initialize catalyst app inside request context if possible
                self.app = zcatalyst_sdk.initialize(request)
            except Exception as e:
                logger.warning(f"Failed to initialize zcatalyst_sdk in request context: {e}. Falling back to mock data.")
                self.has_catalyst = False

    def get_datastore(self):
        if self.has_catalyst and self.app:
            return self.app.datastore()
        return None

    def get_filestore(self):
        if self.has_catalyst and self.app:
            return self.app.filestore()
        return None
