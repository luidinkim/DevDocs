import Link from 'next/link'

interface CardProps {
  title: string
  description: string
  href: string
  icon?: string
}

export default function Card({ title, description, href, icon }: CardProps) {
  return (
    <Link href={href}>
      <div className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
        {icon && (
          <div className="mb-3 text-3xl">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </Link>
  )
}