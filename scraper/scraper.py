import os
import requests

from argparse import ArgumentParser
from logging import getLogger, Formatter, DEBUG
from logging.handlers import SysLogHandler

from bigchaindb_driver import BigchainDB


import pprint


BDB_SERVER_URL = os.getenv('BDB_SERVER_URL', 'http://localhost:9984')


class Scraper(object):
    def __init__(self, public_key, private_key, log):
        self.bdb = BigchainDB(BDB_SERVER_URL)
        self.keypair = {
            'private_key': private_key,
            'public_key': public_key
        }
        print(self.keypair)
        self.logger = log

    def add_swapi(self):
        SWAPI_URL = "http://swapi.co/api/"

        response = requests.get(SWAPI_URL + 'planets')

        if response.status_code == 200:
            json_data = response.json()
            for result in json_data['results']:
                self.send_to_bdb({
                    'type': 'search:results',
                    'data': {
                        'source': 'swapi:planets',
                        'result': result
                    }
                }, metadata=None)

    def send_to_bdb(self, asset, metadata):
        bdb_asset = {
            'data': asset
        }
        prepared_creation_tx = self.bdb.transactions.prepare(
            operation='CREATE',
            signers=self.keypair['public_key'],
            asset=bdb_asset,
            metadata=metadata
        )
        fulfilled_tx = self.bdb.transactions.fulfill(
            prepared_creation_tx,
            private_keys=self.keypair['private_key']
        )
        self.bdb.transactions.send(fulfilled_tx)
        self.logger.debug(fulfilled_tx['id'])
        pprint.pprint(fulfilled_tx, indent=2)
        return fulfilled_tx


if __name__ == '__main__':
    # argument parsing
    parser = ArgumentParser(description='BDB/Scraper')
    req_group = parser.add_argument_group('required arguments')
    req_group.add_argument('--public-key', type=str, required=True,
                           help='admin public key')
    req_group.add_argument('--private-key', type=str, required=True,
                           help='admin private key')
    req_group.add_argument('--cmd', type=str, required=True,
                           help='Scraper command')

    args = parser.parse_args()
    # set up logging
    logger = getLogger('scraper_service')
    logger.setLevel(DEBUG)
    # local syslog
    local_formatter = Formatter(
        "%(name)s %(threadName)s %(levelname)s -- %(message)s",
        datefmt='%Y-%m-%d %H:%M:%S')
    local_syslog = SysLogHandler(address='/dev/log',
                                 facility=SysLogHandler.LOG_SYSLOG)
    local_syslog.setFormatter(local_formatter)
    logger.addHandler(local_syslog)

    scraper = Scraper(args.public_key, args.private_key, logger)

    if args.cmd == 'swapi':
        scraper.add_swapi()
