import { whoami } from "@renderer/atoms/user"
import { cn } from "@renderer/lib/utils"
import { usePresentUserProfileModal } from "@renderer/modules/profile/hooks"
import type { MotionValue } from "framer-motion"
import { useMotionValueEvent, useScroll } from "framer-motion"
import type { FC } from "react"
import { cloneElement, useState } from "react"
import { Link } from "react-router-dom"

import { FollowIcon } from "./icons/follow"
import { Logo } from "./icons/logo"
import { UserAvatar } from "./user-button"

const useMotionValueToState = (value: MotionValue<number>) => {
  const [state, setState] = useState(value.get())
  useMotionValueEvent(value, "change", (v) => setState(v))
  return state
}

export function Header() {
  const present = usePresentUserProfileModal()

  const { scrollY } = useScroll()
  const scrollYState = useMotionValueToState(scrollY)

  return (
    <header className="fixed inset-x-0 top-0 z-[99] px-5 py-2 lg:px-0">
      <div className="relative mx-auto my-4 flex w-full max-w-[1240px] items-center justify-between">
        <div
          className="absolute inset-0 z-0 -mx-3 -my-2 rounded-full bg-slate-50/80 backdrop-blur-lg dark:bg-neutral-900/80 lg:-mx-8"
          style={{
            opacity: scrollYState / 100,
          }}
        />

        <div className="relative z-10 flex w-full items-center justify-between gap-8 px-3">
          <div className="flex grow items-center gap-8">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Logo className="size-8" />
            </div>

            <div className="mx-6 hidden gap-12 text-sm font-medium lg:flex [&>div]:hover:cursor-pointer">
              <HoverableLink href="/" icon={<FollowIcon />} label="App" />

              <HoverableLink
                href="https://github.com/RSSNext/follow/releases"
                icon={<i className="i-mgc-download-2-cute-fi" />}
                label="Download"
              />
            </div>
          </div>
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => {
              present(whoami()?.id)
            }}
          >
            <UserAvatar className="h-10 bg-transparent p-0" hideName />
          </button>
        </div>
      </div>
    </header>
  )
}

const HoverableLink: FC<{
  label: string
  icon: React.JSX.Element
  href: string
  className?: string
}> = ({ icon, label, href, className }) => (
  <Link
    to={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    className={cn("group center flex gap-3 duration-200 hover:text-accent", className)}
  >
    <span>{cloneElement(icon, { className: `size-3 ${icon.props.className}` })}</span>
    <span className="inline-flex h-[1.5em] flex-col overflow-hidden leading-[1.5em]">
      <span className="inline-flex flex-col gap-2 duration-200 group-hover:translate-y-[calc(-50%-0.25em)]">
        <span>{label}</span>
        <span>{label}</span>
      </span>
    </span>
  </Link>
)
