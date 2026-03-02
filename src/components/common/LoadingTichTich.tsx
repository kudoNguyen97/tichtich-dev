import { cn } from '@/utils/cn'
import { Dialog, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components'

interface LoadingTichTichProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean,
  isLoading?: boolean
}

const sizes = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
}

export function LoadingTichTich({ isLoading = false }: LoadingTichTichProps) {
    // if (!isLoading) return null;
    // return (
    //   <div className="fixed inset-0 flex flex-col items-center justify-center bg-green-100 opacity-50 z-50">
    //     <div className="w-[170px] h-[170px]">
    //         <img src="/pig-loading.svg" alt="logo" className="w-full h-full object-contain" />
    //     </div>
    //     <div className="text-2xl font-bold">
    //         Loading...
    //     </div>
    //   </div>
    // )
    return (
        <DialogTrigger isOpen={isLoading}>
          <ModalOverlay className="z-1000 bg-black/20 backdrop-blur-xs flex items-center justify-center fixed inset-0">
            <Modal
              className="outline-none border-none bg-transparent shadow-none p-0 m-0 flex items-center justify-center"
            >
              <Dialog>
                <div className="flex flex-col items-center gap-4 py-8 px-6  min-w-[200px]">
                   <div className="w-[170px] h-[170px]">
                    <img src="/pig-loading.svg" alt="logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-bold">
                        Loading...
                    </div>
                </div>
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>

    )
}
