import React from 'react'
import {
    Sheet,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetContent
} from '../ui/sheet'
import { Menu  } from 'lucide-react';

function MobileNav() {
    return (
        <Sheet >
            <SheetTrigger className="cursor-pointer">
                <Menu />
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}

export default MobileNav
