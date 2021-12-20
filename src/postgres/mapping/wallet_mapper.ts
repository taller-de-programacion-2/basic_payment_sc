import { WalletEntity } from '../entity/wallet_entity';
import { Wallet } from '../../model/wallet';

export const mapToWallet = (walletEntity: WalletEntity): Wallet => {
    return {
        id: walletEntity.id,
        user_id: walletEntity.user_id,
        privateKey: walletEntity.privateKey,
        address: walletEntity.address,
    };
};

export const mapToWalletArray = (walletsEntities: WalletEntity[]): Wallet[] => {
    const wallets = [];

    for (const walletEntity of walletsEntities) {
        wallets.push(mapToWallet(walletEntity));
    }

    return wallets;
};
