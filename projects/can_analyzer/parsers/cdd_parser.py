import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Any
import logging

class CDDParser:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dids = {}
        self.dtcs = {}
        self.variants = {}
        
    def load_cdd_file(self, cdd_path: str) -> bool:
        """Load and parse CDD file"""
        try:
            tree = ET.parse(cdd_path)
            root = tree.getroot()
            
            # Parse DIDs (Data Identifier)
            self._parse_dids(root)
            
            # Parse DTCs (Diagnostic Trouble Codes)
            self._parse_dtcs(root)
            
            # Parse Variants
            self._parse_variants(root)
            
            self.logger.info(f"Loaded CDD file: {cdd_path}")
            self.logger.info(f"Found {len(self.dids)} DIDs and {len(self.dtcs)} DTCs")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to load CDD file: {e}")
            return False
    
    def _parse_dids(self, root: ET.Element):
        """Parse Data Identifiers from CDD"""
        for did_elem in root.findall('.//DATA-IDENTIFIER'):
            did_name = did_elem.get('NAME', '')
            did_id = did_elem.get('ID', '')
            
            if did_name and did_id:
                self.dids[did_id] = {
                    'name': did_name,
                    'id': did_id,
                    'length': did_elem.get('LENGTH', ''),
                    'description': did_elem.get('DESC', '')
                }
    
    def _parse_dtcs(self, root: ET.Element):
        """Parse Diagnostic Trouble Codes from CDD"""
        for dtc_elem in root.findall('.//DTC'):
            dtc_name = dtc_elem.get('NAME', '')
            dtc_code = dtc_elem.get('CODE', '')
            
            if dtc_name and dtc_code:
                self.dtcs[dtc_code] = {
                    'name': dtc_name,
                    'code': dtc_code,
                    'description': dtc_elem.get('DESC', ''),
                    'severity': dtc_elem.get('SEVERITY', '')
                }
    
    def _parse_variants(self, root: ET.Element):
        """Parse Variants from CDD"""
        for var_elem in root.findall('.//VARIANT'):
            var_name = var_elem.get('NAME', '')
            if var_name:
                self.variants[var_name] = var_name
    
    def get_did_info(self, did: str) -> Optional[Dict]:
        """Get DID information by ID"""
        return self.dids.get(did.upper())
    
    def get_dtc_info(self, dtc: str) -> Optional[Dict]:
        """Get DTC information by code"""
        return self.dtcs.get(dtc.upper())
    
    def get_all_dids(self) -> List[str]:
        """Get list of all DIDs"""
        return list(self.dids.keys())
    
    def get_all_dtcs(self) -> List[str]:
        """Get list of all DTCs"""
        return list(self.dtcs.keys())