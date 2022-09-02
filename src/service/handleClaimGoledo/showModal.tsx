import React, { useState, useEffect } from 'react';
import { useGoledoBalance, useGoledoStakedBalance, useGoledoUsdPrice } from '@store/index';
import { showModal, hideAllModal } from '@components/showPopup/Modal';
import Button from '@components/Button';
import BalanceText from '@components/BalanceText';
import useTransaction from '@hooks/useTransaction';
import Success from '@assets/icons/success.svg';
import Error from '@assets/icons/error.svg';
import { handleClaimGoledo } from './index';

const ModalContent: React.FC = () => {
  const balance = useGoledoBalance();
  const stakedBalance = useGoledoStakedBalance();
  const usdPrice = useGoledoUsdPrice();

  const { status: transactionStatus, scanUrl, error, sendTransaction } = useTransaction(handleClaimGoledo);

  const [balanceBefore, setBalanceBefore] = useState<typeof balance | undefined>(undefined);
  const [stakedBalanceBefore, setStakedBalanceBefore] = useState<typeof stakedBalance | undefined>(undefined);
  useEffect(() => {
    if (transactionStatus === 'sending') {
      setBalanceBefore(balance);
      setStakedBalanceBefore(stakedBalance);
    }
  }, [transactionStatus]);

  if (!stakedBalance || !balance) return null;
  return (
    <div className='relative'>
      {transactionStatus !== 'success' && transactionStatus !== 'failed' && (
        <>
          <p className="mt-30px mb-4px text-14px text-#62677B">Transaction overview.</p>
          <div className="flex flex-col gap-16px p-12px rounded-4px border-1px border-#EAEBEF text-14px text-#303549">
            <div className="flex justify-between">
              <span>Amount</span>
              <div className="text-right">
                <BalanceText balance={stakedBalanceBefore || stakedBalance} symbol="GOL" decimals={18} placement="top" />
                <p className="mt-2px text-12px text-#62677B">${(stakedBalanceBefore || stakedBalance)?.mul(usdPrice!).toDecimalStandardUnit(2)}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <span>Your GOL balance</span>
              <div className="text-right">
                <p>
                  <span>{(balanceBefore || balance)?.toDecimalStandardUnit(2)}</span>
                  <span className="i-fa6-solid:arrow-right-long mx-6px text-12px translate-y-[-1px]" />
                  <span>{(balanceBefore || balance)?.add(stakedBalanceBefore || stakedBalance)?.toDecimalStandardUnit(2)}</span>
                </p>
                <p className="mt-2px text-12px text-#62677B">
                  <span>${(balanceBefore || balance)?.mul(usdPrice!).toDecimalStandardUnit(2)}</span>
                  <span className="i-fa6-solid:arrow-right-long mx-6px text-10px translate-y-[-1px]" />
                  <span>${(balanceBefore || balance)?.add(stakedBalanceBefore || stakedBalance)?.mul(usdPrice!).toDecimalStandardUnit(2)}</span>
                </p>
              </div>
            </div>
          </div>

          <Button
            fullWidth
            size="large"
            className="mt-48px"
            disabled={transactionStatus === 'sending'}
            loading={transactionStatus === 'sending' ? 'start' : undefined}
            onClick={sendTransaction}
          >
            {transactionStatus === 'waiting' && 'Claim'}
            {transactionStatus === 'sending' && 'Claiming GOL...'}
          </Button>
        </>
      )}
      {(transactionStatus === 'success' || transactionStatus === 'failed') && (
        <>
          <img src={transactionStatus === 'success' ? Success : Error} alt={transactionStatus} className="block w-48px h-48px mt-24px mx-auto" />
          <p className="mt-12px mb-8px text-20px text-#303549 text-center font-semibold">
            {transactionStatus === 'success' && 'All done!'}
            {transactionStatus === 'failed' && 'Transaction failed!'}
          </p>
          <p className="text-14px text-#303549 text-center">
            {transactionStatus === 'success' && (
              <>
                You claimed <span className='font-semibold'>{stakedBalanceBefore?.toDecimalStandardUnit(2)}</span> GOL
              </>
            )}
            {transactionStatus === 'failed' && error}
          </p>
          {scanUrl &&
            <a
              className='absolute bottom-50px right-0px text-12px text-#383515 no-underline hover:underline'
              href={scanUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Review tx details
              <span className='i-charm:link-external ml-3px text-10px translate-y-[-.5px]' />
            </a>
          }
          <Button fullWidth size="large" className="mt-48px" onClick={hideAllModal}>
            OK
          </Button>
        </>
      )}
    </div>
  );
};

const showVestingGoledoModal = () =>
  showModal({ Content: <ModalContent />, title: 'Claim Goledo' });

export default showVestingGoledoModal;
